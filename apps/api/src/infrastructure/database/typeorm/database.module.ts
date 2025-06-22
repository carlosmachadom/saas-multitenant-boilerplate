import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminDatabaseService as PackageAdminDatabaseService } from '@workspace/database';
import { AdminDatabaseService } from './admin-database.service';
import databaseConfig, { DatabaseConfig } from 'src/config/database.config';


@Global()
@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: (dbConfig: DatabaseConfig) => {
            return PackageAdminDatabaseService.getInstance(dbConfig);
          },
          inject: [databaseConfig.KEY],
        },
        AdminDatabaseService,
      ],
      exports: [AdminDatabaseService],
    };
  }
}
