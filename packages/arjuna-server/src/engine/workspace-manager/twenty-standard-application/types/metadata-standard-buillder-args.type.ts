import { type AllMetadataName } from 'arjuna-shared/metadata';

import { type MetadataValidationRelatedFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/metadata-related-types.type';
import { type StandardObjectMetadataRelatedEntityIds } from 'src/engine/workspace-manager/arjuna-standard-application/utils/get-standard-object-metadata-related-entity-ids.util';
import { type ComputeArjunaCRMStandardApplicationAllFlatEntityMapsArgs } from 'src/engine/workspace-manager/arjuna-standard-application/utils/arjuna-standard-application-all-flat-entity-maps.constant';

export type StandardBuilderArgs<T extends AllMetadataName> = {
  standardObjectMetadataRelatedEntityIds: StandardObjectMetadataRelatedEntityIds;
  dependencyFlatEntityMaps: MetadataValidationRelatedFlatEntityMaps<T>;
} & ComputeArjunaCRMStandardApplicationAllFlatEntityMapsArgs;
