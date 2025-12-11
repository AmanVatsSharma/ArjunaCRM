import { type ObjectRecord } from 'arjuna-shared/types';

export interface QueryResultGetterHandlerInterface {
  handle(
    objectRecord: ObjectRecord,
    workspaceId: string,
  ): Promise<ObjectRecord>;
}
