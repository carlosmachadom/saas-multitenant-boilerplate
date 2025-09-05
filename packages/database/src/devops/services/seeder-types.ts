import { Permission, Role } from "@workspace/contracts";

export type PermissionSeeder = Permission & {
  permissionTypeCode: string;
  auditResourceName?: string;
};

export type RoleSeeder = Role & {
  permissionCodes: string[];
  roleTypeCode: string;
};
