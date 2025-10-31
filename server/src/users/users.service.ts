import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  transformUserRecord,
  getObjectsByUserId,
} from "./utils/transform-user-data";
import * as fs from "fs";
import { Op } from "sequelize";
import { ObjectModel, ObjectAttributes } from "../objects/object.model";

interface FindAllOptions {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: "ASC" | "DESC";
  filterField?: string;
  filterValue?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(options: FindAllOptions & { search?: string }) {
    const {
      page,
      limit,
      sortField,
      sortOrder,
      filterField,
      filterValue,
      search,
    } = options;
    const offset = (page - 1) * limit;

    // Base filter
    const where: any = {};

    if (filterField && filterValue) {
      where[filterField] = {
        [Op.iLike]: `%${filterValue}%`,
      };
    }

    // Search across multiple fields
    if (search) {
      where[Op.or] = [
        { userId: { [Op.iLike]: `%${search}%` } },
        { userName: { [Op.iLike]: `%${search}%` } },
        { userEmail: { [Op.iLike]: `%${search}%` } },
        { Privileges: { [Op.iLike]: `%${search}%` } },
        { ipAddress: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: data, count: total } = await this.userModel.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      offset,
      limit,
    });

    return { data, total };
  }

  async getUsersWithObjects(options: FindAllOptions & { search?: string }) {
    const {
      page,
      limit,
      sortField,
      sortOrder,
      filterField,
      filterValue,
      search,
    } = options;
    const offset = (page - 1) * limit;

    // Base filter
    const where: any = {};

    if (filterField && filterValue) {
      where[filterField] = {
        [Op.iLike]: `%${filterValue}%`,
      };
    }

    // Search across multiple fields
    if (search) {
      where[Op.or] = [
        { userName: { [Op.iLike]: `%${search}%` } },
        { userEmail: { [Op.iLike]: `%${search}%` } },
        { Privileges: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows: data, count: total } = await this.userModel.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      offset,
      limit,
      include: [
        {
          association: "objects",
          attributes: [
            "objectId",
            "name",
            "IMEI",
            "active",
            "expiryDate",
            "lastConnection",
            "status",
          ],
        },
      ],
    });

    return { data, total };
  }

  findOne(userId: string) {
    return this.userModel.findByPk(userId, {
      include: [
        {
          association: "objects",
          attributes: [
            "objectId",
            "name",
            "IMEI",
            "active",
            "expiryDate",
            "lastConnection",
            "status",
          ],
        },
      ],
    });
  }

  create(createDto: CreateUserDto) {
    return this.userModel.create(createDto);
  }

  async update(userId: string, updateDto: UpdateUserDto) {
    // .update returns [affectedCount]
    await this.userModel.update(updateDto, { where: { userId } });
    return this.findOne(userId);
  }

  remove(userId: string) {
    return this.userModel.destroy({ where: { userId } });
  }

  async importFromFile(filePath: string) {
    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw);
    console.log(`Importing ${json.length} users from ${filePath}`);

    // ✅ Explicitly type this array
    const objectBuffer: ObjectAttributes[] = [];

    const USER_BATCH_SIZE = 100;
    const OBJECT_BATCH_SIZE = 300;
    let objectCounter = 0;
    let userCounter = 0;

    // ----- 1) Upsert Users in Batches -----
    for (let i = 0; i < json.length; i++) {
      const record = json[i];
      console.log(`Processing User ${i + 1} of ${json.length}`);
      const transformed = await transformUserRecord(record);
      await this.userModel.upsert(transformed);
      console.log("Processed User:", transformed.userId);
      userCounter++;

      // Collect objects for later batch insert
      const objects = await getObjectsByUserId(transformed.userId);

      if (objects && objects.length > 0) {
        objectCounter += objects.length;
        console.log(
          `User ${transformed.userId} has ${objects.length} objects. Total objects so far: ${objectCounter}`
        );
        await ObjectModel.bulkCreate(objects, {
          updateOnDuplicate: [
            "name",
            "IMEI",
            "active",
            "expiryDate",
            "lastConnection",
            "status",
          ],
          returning: false,
        });
        console.log(
          `Upserted ${objects.length} objects for User ${transformed.userId}`
        );
        // for (const o of objects) {
        //   // ✅ Ensure this matches your ObjectAttributes structure
        //   objectBuffer.push({
        //     objectId: o.objectId,
        //     userId: o.userId,
        //     name: o.name,
        //     IMEI: o.IMEI,
        //     active: o.active,
        //     expiryDate: o.expiryDate,
        //     lastConnection: o.lastConnection,
        //     status: o.status,
        //   });
        // }
      }

      // (Optional) small delay every batch to reduce DB load
      // if (i % USER_BATCH_SIZE === 0 && i > 0) {
      //   await new Promise((res) => setTimeout(res, 50));
      // }
    }

    // ----- 2) Bulk insert objects in batches -----
    // for (let i = 0; i < objectBuffer.length; i += OBJECT_BATCH_SIZE) {
    //   const chunk = objectBuffer.slice(i, i + OBJECT_BATCH_SIZE);

    //   await ObjectModel.bulkCreate(chunk, {
    //     updateOnDuplicate: [
    //       "name",
    //       "IMEI",
    //       "active",
    //       "expiryDate",
    //       "lastConnection",
    //       "status",
    //     ],
    //     returning: false,
    //   });

    //   await new Promise((res) => setTimeout(res, 50));
    // }

    return { success: true, users: userCounter, objects: objectCounter };
  }
}
