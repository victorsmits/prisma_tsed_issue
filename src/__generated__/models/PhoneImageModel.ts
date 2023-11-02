import { PhoneImage } from "../client";
import { Integer, Required, Property, Allow, Format } from "@tsed/schema";

export class PhoneImageModel implements PhoneImage {
  @Property(Number)
  @Integer()
  @Required()
  id: number;

  @Property(Number)
  @Integer()
  @Allow(null)
  playerId: number | null;

  @Property(String)
  @Allow(null)
  url: string | null;

  @Property(Date)
  @Format("date-time")
  @Allow(null)
  time: Date | null;

  @Property(Boolean)
  @Allow(null)
  deleted: boolean | null;
}

