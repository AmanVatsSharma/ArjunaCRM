import { createState } from 'arjuna-ui/utilities';
import { type ClientAiModelConfig } from '~/generated-metadata/graphql';

export const aiModelsState = createState<ClientAiModelConfig[]>({
  key: 'aiModelsState',
  defaultValue: [],
});
