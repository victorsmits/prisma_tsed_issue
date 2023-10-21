import {Inject, Injectable} from '@tsed/di';
import {PrismaService} from '@tsed/prisma';

@Injectable()
export class PictureService {

  @Inject()
  protected prisma: PrismaService;

  getImagesByPlayerId(playerId: number) {
    return this.prisma.phone_image.findMany({
      where: {
        playerId: playerId,
        deleted: false,
      },
    });
  }

}
