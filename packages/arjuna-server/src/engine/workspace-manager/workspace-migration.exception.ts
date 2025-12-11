import { type WorkspaceMigrationV2ExceptionCode } from 'arjuna-shared/metadata';

import { CustomException } from 'src/utils/custom-exception';

export class WorkspaceMigrationV2Exception extends CustomException<WorkspaceMigrationV2ExceptionCode> {}
