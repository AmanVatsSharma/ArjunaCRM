import { type FactoryProvider, type ModuleMetadata } from '@nestjs/common';

export interface ArjunaCRMORMOptions {
  [key: string]: unknown;
}

export type ArjunaCRMORMModuleAsyncOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => ArjunaCRMORMOptions | Promise<ArjunaCRMORMOptions>;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;
