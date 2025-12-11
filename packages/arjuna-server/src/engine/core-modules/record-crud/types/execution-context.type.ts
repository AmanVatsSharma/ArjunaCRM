import { type ActorMetadata } from 'arjuna-shared/types';

import { type RolePermissionConfig } from 'src/engine/arjuna-orm/types/role-permission-config';

export type RecordCrudExecutionContext = {
  workspaceId: string;
  rolePermissionConfig?: RolePermissionConfig;
};

export type CreateRecordExecutionContext = RecordCrudExecutionContext & {
  createdBy?: ActorMetadata;
};
