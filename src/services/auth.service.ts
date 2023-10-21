import {Res} from '@tsed/common';
import {Injectable} from '@tsed/di';
import {AccountsModel} from '@tsed/prisma';
import {sign} from 'jsonwebtoken';
import {envs} from '../config/envs';

@Injectable()
export class AuthService {
  
  setCookie(data: AccountsModel, res: Res) {
    const expireDate = new Date(new Date().setDate(new Date().getDate() + 60))
    
    const token = sign(
        {
          data,
        },
        envs.security.jwt_secret,
        {expiresIn: '24h'},
    );
    
    const refreshToken = sign(
        {
          data: {
            DiscordId: data.DiscordId,
          },
        },
        envs.security.jwt_secret,
        {expiresIn: '60d'},
    );
    
    res.cookie(envs.security.cookie, token, {
      secure: true,
      sameSite: "none",
      domain: envs.security.cookie_domain,
      expires: expireDate,
    });
    
    res.cookie(envs.security.refresh_cookie, refreshToken, {
      secure: true,
      sameSite: "none",
      domain: envs.security.cookie_domain,
      path: '/auth/refresh',
      expires: expireDate,
    });
  }
}
