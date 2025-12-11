import { type FieldMetadataType } from 'arjuna-shared/types';

export type WorkflowFormFieldType =
  | FieldMetadataType.TEXT
  | FieldMetadataType.NUMBER
  | FieldMetadataType.DATE
  | FieldMetadataType.SELECT
  | 'RECORD';
