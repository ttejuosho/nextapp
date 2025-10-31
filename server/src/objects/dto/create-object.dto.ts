import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateObjectDto {
  @IsString()
  objectId: string;

  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  IMEI: string;

  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  lastConnection?: string;

  @IsBoolean()
  status: boolean;
}
