import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseBoolPipe,
  BadRequestException,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

@Controller('api/objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  // GET /api/objects?page=1&limit=20&sortField=Name&sortOrder=ASC&search=abc
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortField') sortField = 'Name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    return this.objectsService.findAll({
      page: Number(page),
      limit: Number(limit),
      sortField,
      sortOrder,
      search,
    });
  }

  @Get('/byUserId/:userId')
  async findAllByUser(
    @Param('userId') userId: string, // required
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortField') sortField = 'Name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId parameter is required');
    }

    return this.objectsService.findAllByUser({
      userId,
      page: Number(page),
      limit: Number(limit),
      sortField,
      sortOrder,
      search,
    });
  }

  // Fetch all objects for a specific user with pagination, sorting, search
  @Get(':userId')
  async getUserObjects(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortField') sortField = 'Name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    return this.objectsService.findUserObjects({
      userId,
      page: Number(page),
      limit: Number(limit),
      sortField,
      sortOrder,
      search,
    });
  }

  // GET /api/objects/:imei
  @Get(':imei')
  async findOne(@Param('imei') imei: string) {
    return this.objectsService.findOne(imei);
  }

  // POST /api/objects
  @Post()
  async create(@Body() createObjectDto: CreateObjectDto) {
    return this.objectsService.create(createObjectDto);
  }

  // PUT /api/objects/:imei
  @Put(':imei')
  async update(
    @Param('imei') imei: string,
    @Body() updateObjectDto: UpdateObjectDto,
  ) {
    return this.objectsService.update(imei, updateObjectDto);
  }

  // DELETE /api/objects/:imei
  @Delete(':imei')
  async remove(@Param('imei') imei: string) {
    return this.objectsService.remove(imei);
  }
}
