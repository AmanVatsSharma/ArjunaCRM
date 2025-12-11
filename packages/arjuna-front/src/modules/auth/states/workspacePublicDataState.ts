import { type PublicWorkspaceDataOutput } from '~/generated/graphql';
import { createState } from 'arjuna-ui/utilities';

export const workspacePublicDataState =
  createState<PublicWorkspaceDataOutput | null>({
    key: 'workspacePublicDataState',
    defaultValue: null,
  });
