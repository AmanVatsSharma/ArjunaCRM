import { type ObjectsPermissions } from 'arjuna-shared/types';
import {
  DeleteQueryBuilder,
  type DeleteResult,
  type EntityTarget,
  type InsertQueryBuilder,
  type ObjectLiteral,
} from 'typeorm';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { type WhereClause } from 'typeorm/query-builder/WhereClause';

import { type FeatureFlagMap } from 'src/engine/core-modules/feature-flag/interfaces/feature-flag-map.interface';
import { type WorkspaceInternalContext } from 'src/engine/arjuna-orm/interfaces/workspace-internal-context.interface';

import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { computeArjunaCRMORMException } from 'src/engine/arjuna-orm/error-handling/compute-arjuna-orm-exception';
import {
  ArjunaCRMORMException,
  ArjunaCRMORMExceptionCode,
} from 'src/engine/arjuna-orm/exceptions/arjuna-orm.exception';
import { validateQueryIsPermittedOrThrow } from 'src/engine/arjuna-orm/repository/permissions.utils';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-select-query-builder';
import { type WorkspaceSoftDeleteQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-soft-delete-query-builder';
import { type WorkspaceUpdateQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-update-query-builder';
import { applyTableAliasOnWhereCondition } from 'src/engine/arjuna-orm/utils/apply-table-alias-on-where-condition';
import { computeEventSelectQueryBuilder } from 'src/engine/arjuna-orm/utils/compute-event-select-query-builder.util';
import { formatResult } from 'src/engine/arjuna-orm/utils/format-result.util';
import { formatArjunaCRMOrmEventToDatabaseBatchEvent } from 'src/engine/arjuna-orm/utils/format-arjuna-orm-event-to-database-batch-event.util';
import { getObjectMetadataFromEntityTarget } from 'src/engine/arjuna-orm/utils/get-object-metadata-from-entity-target.util';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';

export class WorkspaceDeleteQueryBuilder<
  T extends ObjectLiteral,
> extends DeleteQueryBuilder<T> {
  private objectRecordsPermissions: ObjectsPermissions;
  private shouldBypassPermissionChecks: boolean;
  private internalContext: WorkspaceInternalContext;
  private authContext: AuthContext;
  private featureFlagMap: FeatureFlagMap;
  constructor(
    queryBuilder: DeleteQueryBuilder<T>,
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
  }

  override clone(): this {
    const clonedQueryBuilder = super.clone();

    return new WorkspaceDeleteQueryBuilder(
      clonedQueryBuilder,
      this.objectRecordsPermissions,
      this.internalContext,
      this.shouldBypassPermissionChecks,
      this.authContext,
      this.featureFlagMap,
    ) as this;
  }

  override async execute(): Promise<DeleteResult & { generatedMaps: T[] }> {
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

      const eventSelectQueryBuilder = computeEventSelectQueryBuilder<T>({
        queryBuilder: this,
        authContext: this.authContext,
        internalContext: this.internalContext,
        featureFlagMap: this.featureFlagMap,
        expressionMap: this.expressionMap,
        objectRecordsPermissions: this.objectRecordsPermissions,
      });

      const tableName = computeTableName(
        objectMetadata.nameSingular,
        objectMetadata.isCustom,
      );

      const before = await eventSelectQueryBuilder.getOne();

      this.expressionMap.wheres = applyTableAliasOnWhereCondition({
        condition: this.expressionMap.wheres,
        tableName,
        aliasName: objectMetadata.nameSingular,
      }) as WhereClause[];

      const result = await super.execute();

      const formattedResult = formatResult<T[]>(
        result.raw,
        objectMetadata,
        this.internalContext.flatObjectMetadataMaps,
        this.internalContext.flatFieldMetadataMaps,
      );

      const formattedBefore = formatResult<T[]>(
        before,
        objectMetadata,
        this.internalContext.flatObjectMetadataMaps,
        this.internalContext.flatFieldMetadataMaps,
      );

      this.internalContext.eventEmitterService.emitDatabaseBatchEvent(
        formatArjunaCRMOrmEventToDatabaseBatchEvent({
          action: DatabaseEventAction.DESTROYED,
          objectMetadataItem: objectMetadata,
          flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps,
          workspaceId: this.internalContext.workspaceId,
          entities: formattedBefore,
          authContext: this.authContext,
        }),
      );

      return {
        raw: result.raw,
        generatedMaps: formattedResult,
        affected: result.affected,
      };
    } catch (error) {
      throw computeArjunaCRMORMException(error);
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

  override update(): WorkspaceUpdateQueryBuilder<T>;

  override update(
    updateSet: QueryDeepPartialEntity<T>,
  ): WorkspaceUpdateQueryBuilder<T>;

  override update(
    _updateSet?: QueryDeepPartialEntity<T>,
  ): WorkspaceUpdateQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into an update builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override insert(): InsertQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into an insert builder',
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
}
