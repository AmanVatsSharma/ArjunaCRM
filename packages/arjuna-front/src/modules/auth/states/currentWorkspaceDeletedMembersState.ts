import { createState } from 'arjuna-ui/utilities';
import { type DeletedWorkspaceMember } from '~/generated-metadata/graphql';

export const currentWorkspaceDeletedMembersState = createState<
  DeletedWorkspaceMember[]
>({
  key: 'currentWorkspaceDeletedMembersState',
  defaultValue: [],
});
