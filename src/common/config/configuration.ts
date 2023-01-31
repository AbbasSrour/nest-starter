/* eslint-disable turbo/no-undeclared-env-vars */
import * as process from 'process';

export const configuration = () => ({
  environment: process.env.NODE_ENV,
  app: {
    port: Number.parseInt(process.env.PORT || '4000', 10),
    fallbackLanguage: process.env.FALLBACK_LANGUAGE,
    enableDocumentation: process.env.ENABLE_DOCUMENTATION,
    apiVersion: process.env.API_VERSION,
  },
  jwt: {
    accessToken: {
      privateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
      publicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
      expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    },
    refreshToken: {
      privateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
      publicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
      expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    },
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  security: {
    origin: process.env.ORIGIN,
    encToken: {
      privateKey: process.env.ENC_TOKEN_PRIVATE_KEY,
      publicKey: process.env.ENC_TOKEN_PUBLIC_KEY,
      expiration: process.env.ENC_TOKEN_EXPIRATION,
    },
  },
  monitoring: {
    lokiHost: process.env.LOKI_HOST,
    enableOrmLogs: process.env.ENABLE_ORM_LOGS,
  },
  smtp: {
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    secure: process.env.SMTP_SECURE,
  },
  mail: {
    sender: {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME,
    },
  },
  google: {
    oAuth: {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    },
  },
  facebook: {
    oAuth: {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackUrl: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
    },
  },
  redis: {
    store: process.env.REDIS_STORE_HOST,
    cacheEnabled: process.env.REDIS_CACHE_ENABLED,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    expiration: process.env.REDIS_CACHE_EXPIRATION,
  },
});
