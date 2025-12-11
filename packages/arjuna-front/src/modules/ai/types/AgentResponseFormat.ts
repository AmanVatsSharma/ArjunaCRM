import { type BaseOutputSchemaV2 } from 'arjuna-shared/workflow';

export type AgentResponseFormat =
  | { type: 'text' }
  | {
      type: 'json';
      schema: BaseOutputSchemaV2;
    };
