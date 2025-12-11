import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';

export type ArjunaCRMStandardAllFlatEntityMaps = Pick<
  AllFlatEntityMaps,
  | 'flatIndexMaps'
  | 'flatObjectMetadataMaps'
  | 'flatFieldMetadataMaps'
  | 'flatViewFieldMaps'
  | 'flatViewFilterMaps'
  | 'flatViewGroupMaps'
  | 'flatViewMaps'
>;
