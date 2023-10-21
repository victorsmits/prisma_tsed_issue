import {Cookies, Post, Req, Res} from '@tsed/common';
import {Controller, Inject} from '@tsed/di';
import {BadRequest, Forbidden} from '@tsed/exceptions';
import {AccountsModel, AccountsRepository} from '@tsed/prisma';
import {Get} from '@tsed/schema';
import {verify} from 'jsonwebtoken';
import {envs} from '../../config/envs';
import {AuthService} from '../../services/auth.service';

@Controller('/refresh')
export class RefreshController {
  @Inject()
  protected AuthService: AuthService;
  
  @Inject()
  protected account: AccountsRepository;
  
  @Post('/')
  async refresh(
      @Req() req: Req,
      @Res() res: Res,
      @Cookies(envs.security.refresh_cookie) refresh_token: string,
  ) {
    
    if (!refresh_token) {
      throw new BadRequest('Refresh token not found');
    }
    
    verify(
        refresh_token as string,
        envs.security.jwt_secret,
        async (error, decoded: { data: any }) => {
          if (error) {
            throw new Forbidden('refresh token expire');
          }
          
          const discordId: AccountsModel['DiscordId'] = decoded.data.DiscordId;
          
          const data = await this.account.findUnique({
            where: {
              DiscordId: discordId,
            },
          });
          
          if (!data) {
            throw new Forbidden('User not found');
          }
          
          this.AuthService.setCookie(data, res);
        },
    );
    
    return req.user;
  }
}
