import {Optional, Property} from '@tsed/schema';
import {ProfileEnterpriseModel} from './ProfileEnterpriseModel';
import {ProfilePlayerModel} from './ProfilePlayerModel';

export class ProfileModel {
  @Property()
  DiscordId: string;
  
  @Property()
  SteamId: string;
  
  @Property()
  DiscordName: string;
  
  @Property()
  Banned: boolean;
  
  @Property()
  @Optional()
  player: ProfilePlayerModel;
  
  @Property()
  @Optional()
  enterprise: ProfileEnterpriseModel;
}
