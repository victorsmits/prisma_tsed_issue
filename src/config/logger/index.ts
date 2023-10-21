import {$log, PlatformLoggerSettings} from "@tsed/common";
import {isProduction} from "../envs/index";

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "pattern",
      pattern: `%[\x1b[33m[${process.env.APP_NAME}]\x1b[0m%] [%p] %m`,
    }
  });
  
  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "pattern",
      pattern: `%[\x1b[33m[${process.env.APP_NAME}]\x1b[0m%] [%p] %m`,
    }
  });
}

export default <PlatformLoggerSettings> {
  disableRoutesSummary: isProduction
};
