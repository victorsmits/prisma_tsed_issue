import {Property} from '@tsed/schema';
import {PhoneUsersContactsModel, TdPhoneModel} from "@tsed/prisma";

export class ProfilePlayerModel {
  @Property()
  playerID: number;

  @Property()
  playerFirstName: string;

  @Property()
  playerLastName: string;

  @Property()
  phoneNumber: TdPhoneModel

  @Property()
  phone_user_contacts: PhoneUsersContactsModel
}
