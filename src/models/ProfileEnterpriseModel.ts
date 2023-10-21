import {EntreprisesModel} from '@tsed/prisma';
import {Property} from '@tsed/schema';

export class ProfileEnterpriseModel implements Pick<
    EntreprisesModel,
    'entrepriseID' | 'entrepriseType' | 'entrepriseSubtype'
> {
  @Property()
  entrepriseID: number;
  @Property()
  entrepriseSubtype: string | null;
  @Property()
  entrepriseType: string;
  
}
