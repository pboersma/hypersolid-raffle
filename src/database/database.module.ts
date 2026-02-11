import { Module } from '@nestjs/common';

// TODO: Introduce path aliases.
import { databaseProviders } from './database.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})

export class DatabaseModule {}