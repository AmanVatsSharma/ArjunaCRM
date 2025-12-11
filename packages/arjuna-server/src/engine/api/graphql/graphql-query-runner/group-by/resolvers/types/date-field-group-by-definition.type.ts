import { type ObjectRecordGroupByDateGranularity } from 'arjuna-shared/types';
import { type FirstDayOfTheWeek } from 'arjuna-shared/utils';

export type DateFieldGroupByDefinition = {
  granularity: ObjectRecordGroupByDateGranularity;
  weekStartDay?: FirstDayOfTheWeek;
};
