import {Get, Returns} from '@tsed/schema';
import {Controller, Inject} from '@tsed/di';
import {PhoneImageModel} from '@tsed/prisma';
import {PictureService} from '../../services/picture.service';
import {Req, UseBefore} from '@tsed/common';
import {ProfileModel} from '../../models/ProfileModel';
import {JwtMiddleware} from '../../middlewares/jwt.middleware';

@Controller('/pictures')
@UseBefore(JwtMiddleware)
export class PicturesController {

  @Inject()
  protected pictures: PictureService;

  @Get('/')
  @Returns(200, Array).Of(PhoneImageModel)
  getAllImages(@Req() req: Req) {
    const user = req.user as ProfileModel;
    return this.pictures.getImagesByPlayerId(user.player.playerID);
  }
}
