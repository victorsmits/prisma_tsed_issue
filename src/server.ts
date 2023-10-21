import {CaptureConsole, ExtraErrorData} from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import '@tsed/ajv';
import {PlatformApplication} from '@tsed/common';
import {Configuration, Inject} from '@tsed/di';
import '@tsed/passport';
import '@tsed/platform-express'; // /!\ keep this import
import {AccountsModel, PrismaService} from '@tsed/prisma';
import '@tsed/swagger';
import session from 'express-session';
import {join} from 'path';
import {config} from './config';
import {envs, isProduction} from './config/envs';
import * as rest from './controllers/rest/index';
import * as auth from './controllers/auth/index';
import './protocols';

const MemoryStore = require('memorystore')(session);

@Configuration({
  ...config,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  passport: {
    userInfoModel: AccountsModel,
  },
  mount: {
    '/api': [
      ...Object.values(rest),
    ],
    '/auth': [
      ...Object.values(auth),
    ],
  },
  swagger: [
    {
      path: '/doc',
      specVersion: '3.0.1',
    },
  ],
  middlewares: [
    'cookie-parser',
    'compression',
    'method-override',
    'json-parser',
    {use: 'urlencoded-parser', options: {extended: true}},
    session({
      secret: envs.security.jwt_secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 24,
      },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    }),
    {
      use: 'cors',
      options: {
        origin: [
          'http://localhost',
          'http://localhost:5173',
          'https://tabletapi-dev.21jumpclick.fr',
          'https://tabletapi.21jumpclick.fr',
        ],
        credentials: true,
      },
    },
  ],
  views: {
    root: join(process.cwd(), '../views'),
    extensions: {
      ejs: 'ejs',
    },
  },
  exclude: [
    '**/*.spec.ts',
  ],
})
export class Server {
  @Inject()
  protected app: PlatformApplication;
  
  @Configuration()
  protected settings: Configuration;
  
  @Inject()
  protected client: PrismaService;
  
  public $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set('trust proxy', 1); // trust first proxy
  }
  
  $afterRoutesInit() {
    const app = this.app.getApp() as any;
    
    Sentry.init({
      dsn: envs.sentry.host,
      debug: !isProduction,
      attachStacktrace: true,
      enabled: true,
      enableTracing: true,
      includeLocalVariables: true,
      profilesSampleRate: 1.0,
      integrations: [
        new Sentry.Integrations.Http({tracing: true}),
        new Sentry.Integrations.Console(),
        new Sentry.Integrations.Express({app: app as any}),
        new Sentry.Integrations.Prisma({client: this.client}),
        new Sentry.Integrations.LocalVariables({
          captureAllExceptions: true,
        }),
        new CaptureConsole(),
        new ExtraErrorData(),
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],
      environment: envs.sentry.env,
      tracesSampleRate: 1.0,
      sampleRate: 1.0,
    });
    
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(Sentry.Handlers.tracingHandler());
    // this.app.use(Sentry.Handlers.trpcMiddleware({
    //   attachRpcInput: true,
    // }));
    this.app.use(Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        const statusCode = error.status;
        return !!(
            statusCode && parseInt(statusCode.toString()) >= 400
        );
      },
    }));
  }
}
