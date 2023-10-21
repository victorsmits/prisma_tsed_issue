import * as Sentry from '@sentry/node';
import {BodyParams, QueryParams, Req} from '@tsed/common';
import {Inject} from '@tsed/di';
import {BadRequest, Forbidden} from '@tsed/exceptions';
import {Arg, OnInstall, OnVerify, Protocol} from '@tsed/passport';
import {AccountsRepository} from '@tsed/prisma';
import {IStrategyOptions, Strategy} from 'passport-local';
import {envs} from '../config/envs';

@Protocol<IStrategyOptions>({
  name: 'auth',
  useStrategy: Strategy,
  settings: {
    usernameField: 'id',
    passwordField: 'password',
  },
})
export class BasicProtocol implements OnVerify, OnInstall {
  @Inject()
  protected account: AccountsRepository;
  
  // hook added with v6.99.0
  async $beforeInstall(settings: IStrategyOptions): Promise<IStrategyOptions> {
    // load something from backend
    // settings.usernameField = await this.usersService.loadFieldConfiguration()
    
    return settings;
  }
  
  async $onVerify(
      @Req() request: Req,
      @BodyParams('id') id: string,
      @BodyParams('password') password: string,
  ) {
    
    if (!id || !password) {
      throw new BadRequest('');
    }
    
    const user = await this.account.findUnique({
      where: {
        DiscordId: id,
        Whitelist: 1,
      },
    });
    
    if (!user) {
      throw new Forbidden('User not found in database');
    }
    
    if (password !== envs.security.auth_secret) {
      throw new Forbidden('Password given not correct');
    }
    
    Sentry.setUser(user);
    Sentry.setTag('DiscordID', user.DiscordId);
    Sentry.setTag('DiscordName', user.DiscordName);
    Sentry.setTag('SteamId', user.SteamId);
    
    return user;
  }
  
  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
