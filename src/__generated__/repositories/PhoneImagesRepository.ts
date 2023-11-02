import { isArray } from "@tsed/core";
import { deserialize } from "@tsed/json-mapper";
import { Injectable, Inject } from "@tsed/di";
import { PrismaService } from "../services/PrismaService";
import { Prisma, PhoneImage } from "../client";
import { PhoneImageModel } from "../models";

@Injectable()
export class PhoneImagesRepository {
  @Inject()
  protected prisma: PrismaService;

  get collection() {
    return this.prisma.phoneImage
  }

  get groupBy() {
    return this.collection.groupBy.bind(this.collection)
  }

  protected deserialize<T>(obj: null | PhoneImage | PhoneImage[]): T {
    return deserialize<T>(obj, { type: PhoneImageModel, collectionType: isArray(obj) ? Array : undefined })
  }

  async findUnique(args: Prisma.PhoneImageFindUniqueArgs): Promise<PhoneImageModel | null> {
    const obj = await this.collection.findUnique(args);
    return this.deserialize<PhoneImageModel | null>(obj);
  }

  async findFirst(args: Prisma.PhoneImageFindFirstArgs): Promise<PhoneImageModel | null> {
    const obj = await this.collection.findFirst(args);
    return this.deserialize<PhoneImageModel | null>(obj);
  }

  async findMany(args?: Prisma.PhoneImageFindManyArgs): Promise<PhoneImageModel[]> {
    const obj = await this.collection.findMany(args);
    return this.deserialize<PhoneImageModel[]>(obj);
  }

  async create(args: Prisma.PhoneImageCreateArgs): Promise<PhoneImageModel> {
    const obj = await this.collection.create(args);
    return this.deserialize<PhoneImageModel>(obj);
  }

  async update(args: Prisma.PhoneImageUpdateArgs): Promise<PhoneImageModel> {
    const obj = await this.collection.update(args);
    return this.deserialize<PhoneImageModel>(obj);
  }

  async upsert(args: Prisma.PhoneImageUpsertArgs): Promise<PhoneImageModel> {
    const obj = await this.collection.upsert(args);
    return this.deserialize<PhoneImageModel>(obj);
  }

  async delete(args: Prisma.PhoneImageDeleteArgs): Promise<PhoneImageModel> {
    const obj = await this.collection.delete(args);
    return this.deserialize<PhoneImageModel>(obj);
  }

  deleteMany(args: Prisma.PhoneImageDeleteManyArgs) {
    return this.collection.deleteMany(args)
  }

  updateMany(args: Prisma.PhoneImageUpdateManyArgs) {
    return this.collection.updateMany(args)
  }

  aggregate(args: Prisma.PhoneImageAggregateArgs) {
    return this.collection.aggregate(args)
  }
}
