export class CreateUserDto {
  userId!: string;
  userName?: string;
  userEmail?: string;
  Active?: boolean;
  ExpiryDate?: string;
  Privileges?: string;
  apiAccess?: boolean;
  registrationDate?: string;
  lastLogin?: string;
  ipAddress?: string;
  subAccounts?: number;
  objects?: number;
  Email?: number;
  Sms?: number;
  Webhook?: number;
  API?: number;
}
