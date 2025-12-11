import { type STANDARD_OBJECTS } from 'src/engine/workspace-manager/arjuna-standard-application/constants/standard-object.constant';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/arjuna-standard-application/types/all-standard-object-name.type';

export type AllStandardObjectIndexName<T extends AllStandardObjectName> =
  keyof (typeof STANDARD_OBJECTS)[T]['indexes'];
