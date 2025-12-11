import { localStorageEffect } from '~/utils/recoil-effects';
import { createState } from 'arjuna-ui/utilities';

export const lastVisitedObjectMetadataItemIdState = createState<string | null>({
  key: 'lastVisitedObjectMetadataItemIdState',
  defaultValue: null,
  effects: [localStorageEffect()],
});
