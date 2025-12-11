import { EntitySchemaColumnFactory } from 'src/engine/arjuna-orm/factories/entity-schema-column.factory';
import { EntitySchemaRelationFactory } from 'src/engine/arjuna-orm/factories/entity-schema-relation.factory';
import { EntitySchemaFactory } from 'src/engine/arjuna-orm/factories/entity-schema.factory';
import { WorkspaceDatasourceFactory } from 'src/engine/arjuna-orm/factories/workspace-datasource.factory';

export const entitySchemaFactories = [
  EntitySchemaColumnFactory,
  EntitySchemaRelationFactory,
  EntitySchemaFactory,
  WorkspaceDatasourceFactory,
];
