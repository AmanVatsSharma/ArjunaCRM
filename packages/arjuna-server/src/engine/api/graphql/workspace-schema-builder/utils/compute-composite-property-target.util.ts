import {
  type FieldMetadataType,
  type CompositeProperty,
} from 'arjuna-shared/types';

export const computeCompositePropertyTarget = (
  type: FieldMetadataType,
  compositeProperty: CompositeProperty,
): string => {
  return `${type.toString()}->${compositeProperty.name}`;
};
