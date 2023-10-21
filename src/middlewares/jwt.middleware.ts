import {Accounts} from '@prisma/client';
import * as Sentry from '@sentry/node';
import {Cookies, Next, Req, Session} from '@tsed/common';
import {Inject} from '@tsed/di';
import {BadRequest, Forbidden} from '@tsed/exceptions';
import {Middleware, MiddlewareMethods} from '@tsed/platform-middlewares';
import {verify} from 'jsonwebtoken';
import {envs} from '../config/envs';
import {ProfileModel} from '../models/ProfileModel';
import {PlayerService} from '../services/player.service';

@Middleware()
export class JwtMiddleware implements MiddlewareMethods {
  @Inject()
  protected player: PlayerService;
  
  use(
      @Req() request: Req,
      @Cookies(envs.security.cookie) token: string,
      @Next() next: Next,
      @Session() session: any,
  ) {
    
    if (!token) {
      throw new BadRequest('Token not found');
    }
    
    verify(
        token as string,
        envs.security.jwt_secret,
        async (error, decoded: { data: Accounts }) => {
          if (error) {
            throw new Forbidden('Token expire');
          }
          
          const user: Accounts = decoded.data;
          
          if (user) {
            const profile: ProfileModel = await this.player.getProfile(user);
            
            if (request.session) {
              session.user = profile;
              
              session.save();
            }
            request.user = profile;
            
            Sentry.setUser(profile);
            Sentry.setTag('discordId', user.DiscordId);
            Sentry.setTag('DiscordName', user.DiscordName);
            Sentry.setTag('SteamId', user.SteamId);
            Sentry.setTag('TwitchID', user.TwitchID);
            Sentry.setTag('PlayerId', profile.player.playerID);
            
          } else {
            throw new Forbidden('User not authenticate');
          }
          
          next();
        },
    );
    
  }
}
