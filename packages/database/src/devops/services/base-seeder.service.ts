// services/base-seeder.service.ts
import { EntityManager } from "typeorm";
import { SeederUtils } from "@devops/services/seeder-utils";

import {
  PermissionEntity,
  PermissionTypeEntity,
  TokenRevocationReasonEntity,
  AuditActionEntity,
  AuditResourceEntity,
} from "@core/entities";

import {
  AuditAction,
  AuditResource,
  Permission,
  PermissionType,
  TokenRevocationReason,
} from "@workspace/contracts";
import { PermissionSeeder } from "./seeder-types";

export class BaseSeederService {
  private static instance: BaseSeederService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): BaseSeederService {
    if (!BaseSeederService.instance) {
      BaseSeederService.instance = new BaseSeederService();
    }
    return BaseSeederService.instance;
  }

  public async seedSharedData(manager: EntityManager): Promise<void> {
    if (this.isInitialized) {
      console.log("🔄 Datos compartidos ya fueron inicializados, saltando...");
      return;
    }

    console.log("🔄 Seeding datos compartidos...");

    await this.seedPermissionTypes(manager);
    await this.seedPermissions(manager);
    await this.seedTokenRevocationReasons(manager);
    await this.seedAuditActions(manager);
    await this.seedAuditResources(manager);

    this.isInitialized = true;
    console.log("✅ Datos compartidos completados.");
  }

  public reset(): void {
    this.isInitialized = false;
  }

  private async seedPermissionTypes(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(PermissionTypeEntity);
    const data = SeederUtils.readJsonFile<PermissionType>(
      "shared/permission-types.json"
    );
    await SeederUtils.seedEntity(repository, data, "permission types");
  }

  private async seedPermissions(manager: EntityManager): Promise<void> {
    const permissionRepository = manager.getRepository(PermissionEntity);
    const permissionTypeRepository =
      manager.getRepository(PermissionTypeEntity);

    const permissionTypes = await permissionTypeRepository.find();

    const permissionTypeMap = new Map(
      permissionTypes.map((pt) => [pt.code, pt])
    );

    const rawData = SeederUtils.readJsonFile<PermissionSeeder>(
      "shared/permissions.json"
    );
    
    const transformedData = rawData.map((permission) => {
      const permissionType = permissionTypeMap.get(
        permission.permissionTypeCode
      );

      if (!permissionType) {
        throw new Error(
          `Permission type '${permission.permissionTypeCode}' not found for permission '${permission.code}'`
        );
      }

      const { permissionTypeCode, ...permissionData } = permission;

      return {
        ...permissionData,
        permissionType,
      };
    });

    await SeederUtils.seedEntity(
      permissionRepository,
      transformedData,
      "permissions"
    );
  }

  private async seedTokenRevocationReasons(
    manager: EntityManager
  ): Promise<void> {
    const repository = manager.getRepository(TokenRevocationReasonEntity);
    const data = SeederUtils.readJsonFile<TokenRevocationReason>(
      "shared/token-revocation-reasons.json"
    );
    await SeederUtils.seedEntity(repository, data, "token revocation reasons");
  }

  private async seedAuditActions(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(AuditActionEntity);
    const data = SeederUtils.readJsonFile<AuditAction>(
      "shared/audit-actions.json"
    );
    await SeederUtils.seedEntity(repository, data, "audit actions");
  }

  private async seedAuditResources(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(AuditResourceEntity);
    const data = SeederUtils.readJsonFile<AuditResource>(
      "shared/audit-resources.json"
    );
    await SeederUtils.seedEntity(repository, data, "audit resources");
  }
}
