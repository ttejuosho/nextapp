// services/userService.ts
import { apiRequest } from "@/lib/apiClient";

export type UserRow = {
  userId: string;
  userName: string;
  userEmail: string;
  Active: boolean;
  ExpiryDate: string;
  Privileges: string;
  apiAccess: boolean;
  registrationDate: string;
  lastLogin: string;
  ipAddress?: string;
  subAccounts?: number;
  objectCount?: number;
  Email?: number;
  Sms?: number;
  Webhook?: number;
  API?: number;
};

export type ListUsersParams = {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filterField?: string;
  filterValue?: string;
  search?: string;
};

export type ListUsersResult = {
  data: UserRow[];
  total: number;
};

export const userService = {
  async listUsers(params: ListUsersParams = {}) {
    return apiRequest<ListUsersResult>({
      method: "GET",
      url: "http://localhost:3001/api/users",
      params,
    });
  },
};
