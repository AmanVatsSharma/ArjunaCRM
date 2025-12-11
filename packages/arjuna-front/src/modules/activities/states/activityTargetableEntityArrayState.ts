import { type ActivityTargetableObject } from '../types/ActivityTargetableEntity';
import { createState } from 'arjuna-ui/utilities';

export const activityTargetableEntityArrayState = createState<
  ActivityTargetableObject[]
>({
  key: 'activities/targetable-entity-array',
  defaultValue: [],
});
