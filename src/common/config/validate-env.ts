import * as Joi from 'joi';

export const validateEnv = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'testing')
    .default('development'),

  // App
  PORT: Joi.number().default(3000),
  FALLBACK_LANGUAGE: Joi.string(),
  ENABLE_DOCUMENTATION: Joi.boolean(),
  API_VERSION: Joi.string(),

  // Jwt
  JWT_ACCESS_TOKEN_PRIVATE_KEY: Joi.string(),
  JWT_ACCESS_TOKEN_PUBLIC_KEY: Joi.string(),
  JWT_ACCESS_TOKEN_EXPIRATION: Joi.number(),
  JWT_REFRESH_TOKEN_PRIVATE_KEY: Joi.string(),
  JWT_REFRESH_TOKEN_PUBLIC_KEY: Joi.string(),
  JWT_REFRESH_TOKEN_EXPIRATION: Joi.number(),

  // Database
  DB_TYPE: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string(),

  // Security
  ORIGIN: Joi.string(),
  ENC_TOKEN_PRIVATE_KEY: Joi.string(),
  ENC_TOKEN_PUBLIC_KEY: Joi.string(),
  ENC_TOKEN_EXPIRATION: Joi.string(),

  // Monitoring and logging
  LOKI_HOST: Joi.string(),
  ENABLE_ORM_LOGS: Joi.boolean(),

  // SMTP
  SMTP_USER: Joi.string(),
  SMTP_PASS: Joi.string(),
  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.string(),
  SMTP_SECURE: Joi.string(),

  // Email Service
  SENDER_EMAIL: Joi.string(),
  SENDER_NAME: Joi.string(),

  // Google
  GOOGLE_OAUTH_CLIENT_ID: Joi.string(),
  GOOGLE_OAUTH_CLIENT_SECRET: Joi.string(),
  GOOGLE_OAUTH_CALLBACK_URL: Joi.string(),

  // Facebook
  FACEBOOK_OAUTH_CLIENT_ID: Joi.string(),
  FACEBOOK_OAUTH_CLIENT_SECRET: Joi.string(),
  FACEBOOK_OAUTH_CALLBACK_URL: Joi.string(),

  // Redis
  REDIS_STORE_HOST: Joi.string(),
  REDIS_CACHE_ENABLED: Joi.boolean(),
  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number(),
  REDIS_CACHE_EXPIRATION: Joi.number(),
});
