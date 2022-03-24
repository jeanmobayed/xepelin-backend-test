import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as path from 'path';

export default () => ({
    typeorm: {
        type: 'mysql',
        database: process.env.DB_NAME,
        password:  process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        username:  process.env.DB_USER,
        entities: [path.resolve(__dirname, '..', '**/**.entity!(*.d).{ts,js}')],
        synchronize: true,
        logging: true,
  } as TypeOrmModuleOptions
});