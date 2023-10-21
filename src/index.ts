import {$log} from '@tsed/common';
import {PlatformExpress} from '@tsed/platform-express';
import {envs} from './config/envs';
import {Server} from './server';

async function bootstrap() {
  try {
    console.log('ENVS', envs);
    
    const platform = await PlatformExpress.bootstrap(Server);
    await platform.listen();
    
    process.on('SIGINT', () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({
      event: 'SERVER_BOOTSTRAP_ERROR',
      message: error.message,
      stack: error.stack,
    });
  }
}

bootstrap();
