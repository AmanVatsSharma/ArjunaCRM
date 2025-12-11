import { type Nullable } from 'arjuna-shared/types';

export type RecordAggregateValueByRecordGroupValue = {
  recordGroupValue: string;
  recordAggregateValue: Nullable<string | number>;
};
