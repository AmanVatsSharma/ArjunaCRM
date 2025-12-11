import { type ObjectRecord } from 'arjuna-shared/types';

export type PartialObjectRecordWithId = Partial<ObjectRecord> & { id: string };
