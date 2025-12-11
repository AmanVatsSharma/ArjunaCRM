import camelCase from 'lodash.camelcase';
import { capitalize } from 'arjuna-shared/utils';

export const pascalCase = (str: string) => capitalize(camelCase(str));
