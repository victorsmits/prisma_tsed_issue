import {Controller, Inject} from '@tsed/di';
import {PrismaService} from '@tsed/prisma';
import {Get, Returns} from '@tsed/schema';
import {ProfileModel} from '../../models/ProfileModel';

@Controller('/test')
export class HelloWorldController {
  @Inject()
  protected prisma: PrismaService;
  
  @Get('/')
  @Returns(200, ProfileModel)
  get() {
    return this.prisma.accounts.findMany({
      where: {
        Whitelist: 1,
      },
      include: {
        players: true,
      },
    });
  }
}
