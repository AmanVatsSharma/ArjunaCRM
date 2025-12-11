import { type ObjectsPermissions } from 'arjuna-shared/types';
import {
  type EntityTarget,
  type InsertQueryBuilder,
  type ObjectLiteral,
  type UpdateResult,
} from 'typeorm';
import { SoftDeleteQueryBuilder } from 'typeorm/query-builder/SoftDeleteQueryBuilder';
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
import { type WorkspaceDeleteQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-delete-query-builder';
import { type WorkspaceSelectQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-select-query-builder';
import { type WorkspaceUpdateQueryBuilder } from 'src/engine/arjuna-orm/repository/workspace-update-query-builder';
import { applyTableAliasOnWhereCondition } from 'src/engine/arjuna-orm/utils/apply-table-alias-on-where-condition';
import { computeEventSelectQueryBuilder } from 'src/engine/arjuna-orm/utils/compute-event-select-query-builder.util';
import { formatResult } from 'src/engine/arjuna-orm/utils/format-result.util';
import { formatArjunaCRMOrmEventToDatabaseBatchEvent } from 'src/engine/arjuna-orm/utils/format-arjuna-orm-event-to-database-batch-event.util';
import { getObjectMetadataFromEntityTarget } from 'src/engine/arjuna-orm/utils/get-object-metadata-from-entity-target.util';
import { computeTableName } from 'src/engine/utils/compute-table-name.util';

export class WorkspaceSoftDeleteQueryBuilder<
  T extends ObjectLiteral,
> extends SoftDeleteQueryBuilder<T> {
  private objectRecordsPermissions: ObjectsPermissions;
  private shouldBypassPermissionChecks: boolean;
  private internalContext: WorkspaceInternalContext;
  private authContext: AuthContext;
  private featureFlagMap: FeatureFlagMap;

  constructor(
    queryBuilder: SoftDeleteQueryBuilder<T>,
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

    return new WorkspaceSoftDeleteQueryBuilder(
      clonedQueryBuilder,
      this.objectRecordsPermissions,
      this.internalContext,
      this.shouldBypassPermissionChecks,
      this.authContext,
      this.featureFlagMap,
    ) as this;
  }

  override async execute(): Promise<UpdateResult> {
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

      const beforeEventSelectQueryBuilder = computeEventSelectQueryBuilder<T>({
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

      const before = await beforeEventSelectQueryBuilder.getMany();

      this.expressionMap.wheres = applyTableAliasOnWhereCondition({
        condition: this.expressionMap.wheres,
        tableName,
        aliasName: objectMetadata.nameSingular,
      }) as WhereClause[];

      const after = await super.execute();

      const formattedAfter = formatResult<T[]>(
        after.raw,
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
          action: DatabaseEventAction.DELETED,
          objectMetadataItem: objectMetadata,
          flatFieldMetadataMaps: this.internalContext.flatFieldMetadataMaps,
          workspaceId: this.internalContext.workspaceId,
          entities: formattedBefore,
          authContext: this.authContext,
        }),
      );

      return {
        raw: after.raw,
        generatedMaps: formattedAfter,
        affected: after.affected,
      };
    } catch (error) {
      throw computeArjunaCRMORMException(error);
    }
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

  override insert(): InsertQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into an insert builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
  }

  override delete(): WorkspaceDeleteQueryBuilder<T> {
    throw new ArjunaCRMORMException(
      'This builder cannot morph into a delete builder',
      ArjunaCRMORMExceptionCode.METHOD_NOT_ALLOWED,
    );
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
}
