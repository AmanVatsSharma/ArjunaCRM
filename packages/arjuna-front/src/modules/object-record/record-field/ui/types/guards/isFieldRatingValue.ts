import { RATING_VALUES } from 'arjuna-shared/constants';
import { type FieldRatingValue } from 'arjuna-shared/types';

export const isFieldRatingValue = (
  fieldValue: unknown,
): fieldValue is FieldRatingValue =>
  RATING_VALUES.includes(fieldValue as NonNullable<FieldRatingValue>);
