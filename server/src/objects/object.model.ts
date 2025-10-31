// src/objects/object.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

export interface ObjectAttributes {
  objectId: string;
  userId: string;
  name: string;
  IMEI: string;
  active: boolean;
  expiryDate: string;
  lastConnection: string;
  status: boolean;
}

export type ObjectCreationAttributes = Partial<ObjectAttributes> & {
  userId: string;
};

@Table({ tableName: 'objects', timestamps: false })
export class ObjectModel extends Model<
  ObjectAttributes,
  ObjectCreationAttributes
> {
  @Column({ type: DataType.STRING, primaryKey: true })
  objectId: string;

  @Column({ type: DataType.STRING, unique: true })
  IMEI: string;

  @Column(DataType.STRING)
  name: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  userId: string;

  @Column(DataType.BOOLEAN)
  active: boolean;

  @Column(DataType.STRING)
  expiryDate: string;

  @Column(DataType.STRING)
  lastConnection: string;

  @Column(DataType.BOOLEAN)
  status: boolean;

  @BelongsTo(() => User)
  user: User;
}
