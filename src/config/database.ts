import * as path from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default () => ({
    typeorm: {
        type: 'mysql',
        database: process.env.DB_NAME,
        password:  process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        username:  process.env.DB_USER,
        entities: [path.resolve(__dirname, '..', '**/**.entity!(*.d).{ts,js}')],
        synchronize: process.env.NODE_ENV === 'local',
        logging: process.env.NODE_ENV === 'local',
        port: parseInt(process.env.DB_PORT),
        extra: {
          decimalNumbers: true
        }
  } as MysqlConnectionOptions
});