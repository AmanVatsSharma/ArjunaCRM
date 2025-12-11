import { isDefined } from 'arjuna-shared/utils';
import { type FullNameMetadata } from 'arjuna-shared/types';

export const computeDisplayName = (
  name: FullNameMetadata | null | undefined,
) => {
  if (!name) {
    return '';
  }

  return Object.values(name).filter(isDefined).join(' ');
};
