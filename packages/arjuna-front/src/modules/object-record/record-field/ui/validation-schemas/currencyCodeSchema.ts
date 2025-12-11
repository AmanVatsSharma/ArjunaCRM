import { z } from 'zod';

import { CurrencyCode } from 'arjuna-shared/constants';

export const currencyCodeSchema = z.enum(CurrencyCode);
