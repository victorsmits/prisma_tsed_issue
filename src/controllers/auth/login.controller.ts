import {BodyParams, Post, QueryParams, Req, Res} from '@tsed/common';
import {Controller, Inject} from '@tsed/di';
import {Authenticate} from '@tsed/passport';
import {AccountsModel} from '@tsed/prisma';
import {Get} from '@tsed/schema';
import {AuthService} from '../../services/auth.service';

@Controller('/login')
export class LoginController {
  
  @Inject()
  protected AuthService: AuthService;
  
  @Post('/')
  @Authenticate('auth')
  login(
      @Req() req: Req,
      @Res() res: Res,
      @BodyParams('id') id: string,
      @BodyParams('password') password: string,
  ) {
    
    const data: AccountsModel = req.user as any;
    
    this.AuthService.setCookie(data, res);
    
    return req.user;
  }
}
