import { type ObjectsPermissions } from 'arjuna-shared/types';
import { type PermissionFlagType } from 'arjuna-shared/constants';

export type UserWorkspacePermissions = {
  permissionFlags: Record<PermissionFlagType, boolean>;
  objectsPermissions: ObjectsPermissions;
};
