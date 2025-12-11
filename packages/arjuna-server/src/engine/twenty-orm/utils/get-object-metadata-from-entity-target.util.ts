import { type EntityTarget, type ObjectLiteral } from 'typeorm';

import { type WorkspaceInternalContext } from 'src/engine/arjuna-orm/interfaces/workspace-internal-context.interface';

import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import {
  ArjunaCRMORMException,
  ArjunaCRMORMExceptionCode,
} from 'src/engine/arjuna-orm/exceptions/arjuna-orm.exception';

export const getObjectMetadataFromEntityTarget = <T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  internalContext: WorkspaceInternalContext,
): FlatObjectMetadata => {
  if (typeof entityTarget !== 'string') {
    throw new ArjunaCRMORMException(
      'Entity target must be a string',
      ArjunaCRMORMExceptionCode.MALFORMED_METADATA,
    );
  }

  const objectMetadataName = entityTarget;

  const objectMetadataId =
    internalContext.objectIdByNameSingular[objectMetadataName];

  if (!objectMetadataId) {
    throw new ArjunaCRMORMException(
      `Object metadata for object "${objectMetadataName}" is missing ` +
        `in workspace "${internalContext.workspaceId}" ` +
        `with object metadata collection length: ${
          Object.keys(internalContext.objectIdByNameSingular).length
        }`,
      ArjunaCRMORMExceptionCode.MALFORMED_METADATA,
    );
  }

  const objectMetadata =
    internalContext.flatObjectMetadataMaps.byId[objectMetadataId];

  if (!objectMetadata) {
    throw new ArjunaCRMORMException(
      `Object metadata for object "${objectMetadataName}" (id: ${objectMetadataId}) is missing`,
      ArjunaCRMORMExceptionCode.MALFORMED_METADATA,
    );
  }

  return objectMetadata;
};
