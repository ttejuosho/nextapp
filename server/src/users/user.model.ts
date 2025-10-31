// src/users/user.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { HasMany } from 'sequelize-typescript';
import { ObjectModel } from '../objects/object.model';

// 1. Attributes interface (what exists on the DB)
export interface UserAttributes {
  userId: string;
  userName?: string | null;
  userEmail?: string | null;
  Active?: boolean | null;
  ExpiryDate?: string | null;
  Privileges?: string | null;
  apiAccess?: boolean | null;
  registrationDate?: string | null;
  lastLogin?: string | null;
  ipAddress?: string | null;
  subAccounts?: number | null;
  objectCount?: number | null;
  Email?: number | null;
  Sms?: number | null;
  Webhook?: number | null;
  API?: number | null;
}

// 2. Creation attributes (what you pass to create())
//    Make optional whatever DB can generate or is not required on creation.
export type UserCreationAttributes = Partial<UserAttributes> & {
  userId: string;
};

@Table({ tableName: 'users', timestamps: false })
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @Column({ type: DataType.STRING, primaryKey: true })
  userId: string;

  @Column(DataType.STRING) userName: string;
  @Column(DataType.STRING) userEmail: string;
  @Column(DataType.BOOLEAN) Active: boolean;
  @Column(DataType.STRING) ExpiryDate: string;
  @Column(DataType.STRING) Privileges: string;
  @Column(DataType.BOOLEAN) apiAccess: boolean;
  @Column(DataType.STRING) registrationDate: string;
  @Column(DataType.STRING) lastLogin: string;
  @Column(DataType.STRING) ipAddress: string;
  @Column(DataType.INTEGER) subAccounts: number;
  @Column(DataType.INTEGER) objectCount: number;
  @Column(DataType.INTEGER) Email: number;
  @Column(DataType.INTEGER) Sms: number;
  @Column(DataType.INTEGER) Webhook: number;
  @Column(DataType.INTEGER) API: number;

  @HasMany(() => ObjectModel)
  objects: ObjectModel[];
}
