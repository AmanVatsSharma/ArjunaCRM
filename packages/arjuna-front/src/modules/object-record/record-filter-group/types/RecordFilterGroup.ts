import { type RecordFilterGroupLogicalOperator } from 'arjuna-shared/types';

export type RecordFilterGroup = {
  id: string;
  parentRecordFilterGroupId?: string | null;
  logicalOperator: RecordFilterGroupLogicalOperator;
  positionInRecordFilterGroup?: number | null;
};
