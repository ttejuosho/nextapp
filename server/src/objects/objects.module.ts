import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { ObjectModel } from './object.model';

@Module({
  imports: [SequelizeModule.forFeature([ObjectModel])],
  providers: [ObjectsService],
  controllers: [ObjectsController],
})
export class ObjectsModule {}
