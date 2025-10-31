import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ObjectModel } from './object.model';
import { Op } from 'sequelize';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

export interface FindAllOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface FindUserObjectsOptions {
  userId: string; // Required
  page?: number; // Defaults to 1
  limit?: number; // Defaults to 20
  sortField?: string; // Defaults to 'Name'
  sortOrder?: 'ASC' | 'DESC'; // Defaults to 'ASC'
  search?: string; // Optional search term
}

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectModel)
    private readonly objectModel: typeof ObjectModel,
  ) {}

  async findAll(options: FindAllOptions) {
    const {
      page = 1,
      limit = 20,
      sortField = 'Name',
      sortOrder = 'ASC',
      search,
    } = options;
    const offset = (page - 1) * limit;

    const where = search
      ? {
          [Op.or]: [
            { Name: { [Op.iLike]: `%${search}%` } },
            { IMEI: { [Op.iLike]: `%${search}%` } },
            { userId: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: data, count: total } = await this.objectModel.findAndCountAll(
      {
        where,
        order: [[sortField, sortOrder]],
        offset,
        limit,
      },
    );

    return { data, total };
  }

  async findAllByUser(options: FindAllOptions & { userId: string }) {
    const {
      userId,
      page = 1,
      limit = 20,
      sortField = 'Name',
      sortOrder = 'ASC',
      search,
    } = options;
    const offset = (page - 1) * limit;

    const where: any = { userId };

    if (search) {
      where[Op.or] = [
        { Name: { [Op.iLike]: `%${search}%` } },
        { IMEI: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: data, count: total } = await this.objectModel.findAndCountAll(
      {
        where,
        order: [[sortField, sortOrder]],
        offset,
        limit,
      },
    );

    return { data, total };
  }

  async findUserObjects(options: FindUserObjectsOptions) {
    const {
      userId,
      page = 1,
      limit = 20,
      sortField = 'Name',
      sortOrder = 'ASC',
      search,
    } = options;
    const offset = (page - 1) * limit;

    const where: any = { userId };

    if (search) {
      where[Op.or] = [
        { Name: { [Op.iLike]: `%${search}%` } },
        { IMEI: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: data, count: total } = await this.objectModel.findAndCountAll(
      {
        where,
        order: [[sortField, sortOrder]],
        offset,
        limit,
      },
    );

    return { data, total };
  }

  async findOne(imei: string) {
    const obj = await this.objectModel.findByPk(imei);
    if (!obj) throw new NotFoundException('Object not found');
    return obj;
  }

  async create(createDto: CreateObjectDto) {
    return this.objectModel.create(createDto);
  }

  async update(imei: string, dto: UpdateObjectDto) {
    const obj = await this.findOne(imei);
    return obj.update(dto);
  }

  async remove(imei: string) {
    const obj = await this.findOne(imei);
    await obj.destroy();
    return { message: 'Deleted successfully' };
  }
}
