import { Permission, Role } from "@workspace/contracts";

export type PermissionSeeder = Permission & {
  permissionTypeCode: string;
};

export type RoleSeeder = Role & {
  permissionCodes: string[];
};
