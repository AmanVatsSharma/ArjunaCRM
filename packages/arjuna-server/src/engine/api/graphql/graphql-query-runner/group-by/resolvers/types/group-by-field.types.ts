import { type ObjectRecordGroupByDateGranularity } from 'arjuna-shared/types';
import { type FirstDayOfTheWeek } from 'arjuna-shared/utils';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';

export type GroupByRegularField = {
  fieldMetadata: FlatFieldMetadata;
  subFieldName?: string;
};
export type GroupByDateField = {
  fieldMetadata: FlatFieldMetadata;
  subFieldName?: string;
  dateGranularity: ObjectRecordGroupByDateGranularity;
  weekStartDay?: FirstDayOfTheWeek;
};
export type GroupByRelationField = {
  fieldMetadata: FlatFieldMetadata;
  nestedFieldMetadata: FlatFieldMetadata;
  nestedSubFieldName?: string;
  dateGranularity?: ObjectRecordGroupByDateGranularity;
  weekStartDay?: FirstDayOfTheWeek;
};
export type GroupByField =
  | GroupByRegularField
  | GroupByDateField
  | GroupByRelationField;
