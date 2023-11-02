import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/passport";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import session from "express-session";
import {join} from "path";
import {config} from "./config";
import {envs} from "./config/envs";
import * as rest from "./controllers/rest/index";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  mount: {
    "/api": [
      ...Object.values(rest)
    ]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    {use: "urlencoded-parser", options: {extended: true}},
    session({
      secret: envs.security.jwt_secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 24
      },
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    }),
    {
      use: "cors",
      options: {
        origin: [
          "http://localhost",
          "http://localhost:5173",
          "https://tabletapi-dev.21jumpclick.fr",
          "https://tabletapi.21jumpclick.fr"
        ],
        credentials: true
      }
    }
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.getApp().set("trust proxy", 1); // trust first proxy
  }
}
