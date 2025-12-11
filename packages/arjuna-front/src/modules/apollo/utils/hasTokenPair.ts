import { getTokenPair } from '@/apollo/utils/getTokenPair';
import { isDefined } from 'arjuna-shared/utils';

export const hasTokenPair = () => {
  const tokenPair = getTokenPair();
  return isDefined(tokenPair);
};
