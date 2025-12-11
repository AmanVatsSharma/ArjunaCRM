import { msg } from '@lingui/core/macro';
import { type QueryFailedError } from 'typeorm';

import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import {
  ArjunaCRMORMException,
  ArjunaCRMORMExceptionCode,
} from 'src/engine/arjuna-orm/exceptions/arjuna-orm.exception';

interface PostgreSQLError extends QueryFailedError {
  detail?: string;
}

export const handleDuplicateKeyError = (
  _error: PostgreSQLError,
  _objectMetadata: FlatObjectMetadata,
) => {
  // Since we no longer have indexMetadatas in FlatObjectMetadata,
  // we provide a generic error message
  throw new ArjunaCRMORMException(
    `A duplicate entry was detected`,
    ArjunaCRMORMExceptionCode.DUPLICATE_ENTRY_DETECTED,
    {
      userFriendlyMessage: msg`This record already exists. Please check your data and try again.`,
    },
  );
};
