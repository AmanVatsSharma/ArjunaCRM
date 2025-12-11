import { type ObjectsPermissions } from 'arjuna-shared/types';
import { isDefined } from 'arjuna-shared/utils';
import {
  type EntityTarget,
  InsertQueryBuilder,
  type InsertResult,
  type ObjectLiteral,
} from 'typeorm';

import { type FeatureFlagMap } from 'src/engine/core-modules/feature-flag/interfaces/feature-flag-map.interface';
import { type WorkspaceInternalContext } from 'src/engine/arjuna-orm/interfaces/workspace-internal-context.interface';

import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type QueryDeepPartialEntityWithNestedRelationFields } from 'src/engine/arjuna-orm/entity-manager/types/query-deep-partial-entity-with-nested-relation-fields.type';
import { type RelationConnectQueryConfig } from 'src/engine/arjuna-orm/entity-manager/types/relation-connect-query-config.type';
import { type RelationDisconnectQueryFieldsByEntityIndex } from 'src/engine/arjuna-orm/entity-manager/types/relation-nested-query-fields-by-entity-index.type';
import { type WorkspaceEntityManager } from 'src/engine/arjuna-orm/entity-manager/workspace-entity-manager';
import { computeArjunaCRMORMException } from 'src/engine/arjuna-orm/error-handling/compute-arjuna-orm-exception';
import {
  ArjunaCRMORMException,
  ArjunaCRMORMExceptionCode,
} from 'src/engine/arjuna-orm/exceptions/arjuna-orm.exception';
import { RelationNestedQueries } from 'src/engine/arjuna-orm/relation-nested-queries/relation-nested-queries';
import { validateQueryIsPermittedOrThrow } from 'src/engine/arjuna-orm/repository/permissions.utils';
import { type WorkspaceDeleteQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-delete-query-builder';
import { WorkspaceSelectQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-select-query-builder';
import { type WorkspaceSoftDeleteQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-soft-delete-query-builder';
import { type WorkspaceUpdateQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-update-query-builder';
import { formatData } from 'src/engine/arjuna-orm/utils/format-data.util';
import { formatResult } from 'src/engine/arjuna-orm/utils/format-result.util';
import { formatArjunaCRMOrmEventToDatabaseBatchEvent } from 'src/engine/arjuna-orm/utils/format-arjuna-orm-event-to-database-batch-event.util';
import { getObjectMetadataFromEntityTarget } from 'src/engine/arjuna-orm/utils/get-object-metadata-from-entity-target.util';

export class WorkspaceInsertQueryBuilder<
  T extends ObjectLiteral,
> extends InsertQueryBuilder<T> {
  private objectRecordsPermissions: ObjectsPermissions;
  private shouldBypassPermissionChecks: boolean;
  private internalContext: WorkspaceInternalContext;
  private authContext: AuthContext;
  private featureFlagMap: FeatureFlagMap;
  private relationNestedQueries: RelationNestedQueries;
  private relationNestedConfig:
    | [RelationConnectQueryConfig[], RelationDisconnectQueryFieldsByEntityIndex]
    | null;

  constructor(
    queryBuilder: InsertQueryBuilder<T>,
    objectRecordsPermissions: ObjectsPermissions,
    internalContext: WorkspaceInternalContext,
    shouldBypassPermissionChecks: boolean,
    authContext: AuthContext,
    featureFlagMap: FeatureFlagMap,
  ) {
    super(queryBuilder);
    this.objectRecordsPermissions = objectRecordsPermissions;
    this.internalContext = internalContext;
    this.shouldBypassPermissionChecks = shouldBypassPermissionChecks;
    this.authContext = authContext;
    this.featureFlagMap = featureFlagMap;
    this.relationNestedQueries = new RelationNestedQueries(
      this.internalContext,
    );
  }

  override clone(): this {
    const clonedQueryBuilder = super.clone();

    return new WorkspaceInsertQueryBuilder(
      clonedQueryBuilder,
      this.objectRecordsPermissions,
      this.internalContext,
      this.shouldBypassPermissionChecks,
      this.authContext,
      this.featureFlagMap,
    ) as this;
  }

  override values(
    values:
      | QueryDeepPartialEntityWithNestedRelationFields<T>
      | QueryDeepPartialEntityWithNestedRelationFields<T>[],
  ): this {
    const mainAliasTarget = this.getMainAliasTarget();

    this.relationNestedConfig =
      this.relationNestedQueries.prepareNestedRelationQueries(
        values,
        mainAliasTarget,
      );

    const objectMetadata = getObjectMetadataFromEntityTarget(
      mainAliasTarget,
      this.internalContext,
    );

    const formattedValues = formatData(
      values,
      objectMetadata,
      this.internalContext.flatFieldMetadataMaps,
    );

    return super.values(formattedValues);
  }

  override async execute(): Promise<InsertResult> {
    try {
      validateQueryIsPermittedOrThrow({
        expressionMap: this.expressionMap,
        objectsPermissions: this.objectRecordsPermissions,
        flatObjectMetadataMaps: this.internalContext.flatObjectMetadataMaps,
        flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps,
        objectIdByNameSingular: this.internalContext.objectIdByNameSingular,
        shouldBypassPermissionChecks: this.shouldBypassPermissionChecks,
      });

      const mainAliasTarget = this.getMainAliasTarget();

      const objectMetadata = getObjectMetadataFromEntityTarget(
        mainAliasTarget,
        this.internalContext,
      );

      if (isDefined(this.relationNestedConfig)) {
        const nestedRelationQueryBuilder = new WorkspaceSelectQueryBuilder(
          this as unknown as WorkspaceSelectQueryBuilder<T>,
          this.objectRecordsPermissions,
          this.internalContext,
          this.shouldBypassPermissionChecks,
          this.authContext,
          this.featureFlagMap,
        );

        const updatedValues =
          await this.relationNestedQueries.processRelationNestedQueries({
            entities: this.expressionMap.valuesSet as
              | QueryDeepPartialEntityWithNestedRelationFields<T>
              | QueryDeepPartialEntityWithNestedRelationFields<T>[],
            relationNestedConfig: this.relationNestedConfig,
            queryBuilder: nestedRelationQueryBuilder,
          });

        this.expressionMap.valuesSet = updatedValues;
      }

      const result = await super.execute();
      const eventSelectQueryBuilder = (
        this.connection.manager as WorkspaceEntityManager
      ).createQueryBuilder(
        mainAliasTarget,
        this.expressionMap.mainAlias?.metadata.name ?? '',
        undefined,
        {
          shouldBypassPermissionChecks: true,
        },
      ) as WorkspaceSelectQueryBuilder<T>;

      eventSelectQueryBuilder.whereInIds(
        result.identifiers.map((identifier) => identifier.id),
      );

      const afterResult = await eventSelectQueryBuilder.getMany();

      const formattedResultForEvent = formatResult<T[]>(
        afterResult,
        objectMetadata,
        this.internalContext.flatObjectMetadataMaps,
        this.internalContext.flatFieldMetadataMaps,
      );

      this.internalContext.eventEmitterService.emitDatabaseBatchEvent(
        formatArjunaCRMOrmEventToDatabaseBatchEvent({
          action: DatabaseEventAction.CREATED,
          objectMetadataItem: objectMetadata,
          flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps,
          workspaceId: this.internalContext.workspaceId,
          entities: formattedResultForEvent,
          authContext: this.authContext,
        }),
      );

      this.internalContext.eventEmitterService.emitDatabaseBatchEvent(
        formatArjunaCRMOrmEventToDatabaseBatchEvent({
          action: DatabaseEventAction.UPSERTED,
          objectMetadataItem: objectMetadata,
          flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps,
          workspaceId: this.internalContext.workspaceId,
          entities: formattedResultForEvent,
          authContext: this.authContext,
        }),
      );

      // TypeORM returns all entity columns for insertions
      const resultWithoutInsertionExtraColumns = !isDefined(result.raw)
        ? []
        : result.raw.map((rawResult: Record<string, string>) =>
            Object.keys(rawResult)
              .filter(
                (key) =>
                  this.expressionMap.returning.includes(key) ||
                  this.expressionMap.returning === '*',
              )
              .reduce((filtered: Record<string, string>, key) => {
                filtered[key] = rawResult[key];

                return filtered;
              }, {}),
          );

      const formattedResult = formatResult<T[]>(
        resultWithoutInsertionExtraColumns,
        objectMetadata,
        this.internalContext.flatObjectMetadataMaps,
        this.internalContext.flatFieldMetadataMaps,
      );

      return {
        raw: resultWithoutInsertionExtraColumns,
        generatedMaps: formattedResult,
        identifiers: result.identifiers,
      };
    } catch (error) {
      const objectMetadata = getObjectMetadataFromEntityTarget(
        this.getMainAliasTarget(),
        this.internalContext,
      );

      throw computeArjunaCRMORMException(error, objectMetadata);
    }
  }

  private getMainAliasTarget(): EntityTarget<T> {
    const mainAliasTarget = this.expressionMap.mainAlias?.target;

    if (!mainAliasTarget) {
      throw new ArjunaCRMORMException(
        'Main alias target is missing',
        ArjunaCRMORMExceptionCode.MISSING_MAIN_ALIAS_TARGET,
      );
    }

    return mainAliasTarget;
  }

  override select(): WorkspaceSelectQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into a select builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override update(): WorkspaceUpdateQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into an update builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override delete(): WorkspaceDeleteQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into a delete builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override softDelete(): WorkspaceSoftDeleteQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into a soft delete builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override restore(): WorkspaceSoftDeleteQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into a soft delete builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  setAuthContext(authContext: AuthContext): WorkspaceInsertQueryBuilder<T> {
    this.authContext = authContext;

    return this;
  }
}
