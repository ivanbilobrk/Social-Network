import { TLogLevelName } from 'tslog';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

type configType = {
  environment: string;
  jwTokenKey: string;
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
};

const config: configType = {
  environment: env.ENVIRONMENT || 'development',
  jwtTokenKey: env.SECRET_KEY || 'secret',
  database: {
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    url: `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
  port: Number(env.PORT) || 3000,
  //@ts-ignore
  logLevel: env.LOG_LEVEL || 'debug',
  env: env.NODE_ENV || 'development',
};

export default config;
