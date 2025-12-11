import { ConfigurableModuleBuilder } from '@nestjs/common';

import { type ArjunaCRMORMOptions } from './interfaces/arjuna-orm-options.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ArjunaCRMORMOptions>().build();
