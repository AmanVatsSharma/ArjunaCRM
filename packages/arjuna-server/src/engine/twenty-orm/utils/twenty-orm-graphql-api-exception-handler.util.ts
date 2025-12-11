import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  type ArjunaCRMORMException,
  ArjunaCRMORMExceptionCode,
} from 'src/engine/arjuna-orm/exceptions/arjuna-orm.exception';

export const arjunaORMGraphqlApiExceptionHandler = (
  error: ArjunaCRMORMException,
) => {
  switch (error.code) {
    case ArjunaCRMORMExceptionCode.INVALID_INPUT:
    case ArjunaCRMORMExceptionCode.DUPLICATE_ENTRY_DETECTED:
    case ArjunaCRMORMExceptionCode.CONNECT_RECORD_NOT_FOUND:
    case ArjunaCRMORMExceptionCode.CONNECT_NOT_ALLOWED:
    case ArjunaCRMORMExceptionCode.CONNECT_UNIQUE_CONSTRAINT_ERROR:
    case ArjunaCRMORMExceptionCode.TOO_MANY_RECORDS_TO_UPDATE:
      throw new UserInputError(error.message, {
        userFriendlyMessage: error.userFriendlyMessage,
      });
    default: {
      throw error;
    }
  }
};
