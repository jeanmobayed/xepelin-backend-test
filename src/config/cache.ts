import * as redisStore from 'cache-manager-redis-store';

export default () => ({
  redis: {
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    database: process.env.REDIS_DATABASE,
    password: process.env.REDIS_PASSWORD,
  },
});
