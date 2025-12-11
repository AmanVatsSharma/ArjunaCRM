import { type SpreadsheetImportField } from '@/spreadsheet-import/types';
import { createState } from 'arjuna-ui/utilities';

export const suggestedFieldsByColumnHeaderState = createState({
  key: 'suggestedFieldsByColumnHeaderState',
  defaultValue: {} as Record<string, SpreadsheetImportField[]>,
});
