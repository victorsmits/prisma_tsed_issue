import {loadConfiguration} from '@vicgrk/config';
import dotenv from 'dotenv';

interface Env {
  security: {
    cookie: string
    refresh_cookie: string
    cookie_domain: string
    jwt_secret: string
    auth_secret: string
  };
  sentry: {
    env: string
    host: string
  };
  game: {
    url: string
  };
}

export const isProduction = process.env.NODE_ENV === 'production';
export const isNextApi = process.env.NEXT_API === 'yes';
console.log("isNextApi",isNextApi);
export const envs = loadConfiguration<Env>(isProduction
    ? (
        isNextApi ? 'env.dev.yml' : 'env.prod.yml'
    )
    : 'env.local.yml');
