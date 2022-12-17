import { TLogLevelName } from 'tslog';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

type configType = {
  environment: string;
  appName: string;
  jwTokenKey: string;
  token_expiration: number;
  database: {
    name?: string;
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    url: string;
  };
  port: number;
  logLevel: TLogLevelName;
  env: string;
  blobStorage: {
    connectionString: string;
    containerName: string;
  };
};

const config: configType = {
  appName: env.APP_NAME || 'API',
  environment: env.ENVIRONMENT || 'development',
  jwTokenKey: env.SECRET_KEY || 'secret',
  token_expiration: parseInt(env.TOKEN_EXPIRATION || '3600'),
  database: {
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    url: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
  blobStorage: {
    connectionString: env.BLOB_STORAGE_CONNECTION_STRING || '',
    containerName: env.BLOB_STORAGE_CONTAINER_NAME || 'publicdata',
  },
  port: Number(env.PORT) || 3000,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  logLevel: env.LOG_LEVEL || 'debug',
  env: env.NODE_ENV || 'development',
};

export default config;
