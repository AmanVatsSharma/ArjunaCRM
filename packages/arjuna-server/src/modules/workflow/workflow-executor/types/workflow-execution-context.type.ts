import { type ActorMetadata } from 'arjuna-shared/types';

import { type RolePermissionConfig } from 'src/engine/arjuna-orm/types/role-permission-config';

export type WorkflowExecutionContext = {
  isActingOnBehalfOfUser: boolean;
  initiator: ActorMetadata;
  rolePermissionConfig: RolePermissionConfig;
};
