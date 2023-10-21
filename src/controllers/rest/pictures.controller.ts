import {Get, Returns} from '@tsed/schema';
import {Controller, Inject} from '@tsed/di';
import {PhoneImageModel, PhoneImagesRepository} from '@tsed/prisma';

@Controller('/pictures')
export class PicturesController {

  @Inject()
  protected pictures: PhoneImagesRepository;

  @Get('/')
  @Returns(200, Array).Of(PhoneImageModel)
  getAllImages() {
    return this.pictures.findMany()
  }
}
