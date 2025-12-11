import { type jsonRelationFilterValueSchema } from 'arjuna-shared/utils';
import { type z } from 'zod';

export type RelationFilterValue = z.infer<typeof jsonRelationFilterValueSchema>;
