import { Module } from '@nestjs/common';

import { ArjunaCRMORMModule } from 'src/engine/arjuna-orm/arjuna-orm.module';
import { FavoriteFolderDeletionListener } from 'src/modules/favorite-folder/listeners/favorite-folder.listener';

@Module({
  imports: [ArjunaCRMORMModule],
  providers: [FavoriteFolderDeletionListener],
})
export class FavoriteFolderModule {}
