import {Accounts, entreprises} from '@prisma/client';
import {Inject} from '@tsed/di';
import {deserialize} from '@tsed/json-mapper';
import {PrismaService} from '@tsed/prisma';
import {ProfileModel} from '../models/ProfileModel';

export class PlayerService {

  @Inject()
  protected prisma: PrismaService;

  async getProfile(user: Accounts): Promise<ProfileModel> {
    let enterprise: entreprises | null = null;
    const player = await this.prisma.players.findFirst({
      where: {
        active: 1,
        archived: false,
        steamID: user.SteamId,
      },
    });

    if (player) {
      const playerToEnterprise = await this.prisma.entreprises_players.findFirst(
          {
            where: {
              playerID: player.playerID,
            },
          });

      if (playerToEnterprise) {
        enterprise = await this.prisma.entreprises.findFirst({
          where: {
            entrepriseID: playerToEnterprise.entreprise_id,
          },
        });
      }
    }

    return deserialize<ProfileModel>({
      ...user,
      player,
      enterprise: enterprise?.entrepriseID ? enterprise : null,
    }, {
      type: ProfileModel,
    });
  }
}
