import { CacheModule, Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './config/database';
import application from './config/application';
import cache from './config/cache';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ClientsModule,
    InvoicesModule,
    ConfigModule.forRoot({
      load: [database, application, cache],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm') as MysqlConnectionOptions,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
