import { DataSource, EntityManager, In } from "typeorm";
import {
  AuditResourceEntity,
  PermissionEntity,
  PermissionTypeEntity,
  RoleEntity,
  RoleTypeEntity,
} from "@core/entities";
import { SeederUtils } from "@devops/services/seeder-utils";
import { BaseSeederService } from "./base-seeder.service";
import { PermissionSeeder, RoleSeeder } from "@devops/services/seeder-types";
import { AuditResource, RoleType } from "@workspace/contracts";

export class AdminSeederService {
  private readonly dataSource: DataSource;
  private readonly baseSeeder: BaseSeederService;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.baseSeeder = BaseSeederService.getInstance();
  }

  /**
   * Ejecuta el proceso de seeding para la base de datos de administración dentro de una transacción.
   */
  public async seed(): Promise<void> {
    console.log(
      "--- Iniciando seeding de la base de datos de administración ---"
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log("🚀 Transacción iniciada.");

      // 1. Semillas compartidas primero (usando singleton)
      await this.baseSeeder.seedSharedData(queryRunner.manager);
      await this.baseSeeder.reset();

      // 2. Semillas específicas de admin
      await this.seedAuditResources(queryRunner.manager);
      await this.seedRoleTypes(queryRunner.manager);
      await this.seedPermissions(queryRunner.manager);
      await this.seedRoles(queryRunner.manager);

      await queryRunner.commitTransaction();
      console.log(
        "✅ Seeding de administración completado y transacción confirmada."
      );
    } catch (error) {
      console.error(
        "❌ Error durante el seeding. Revirtiendo la transacción...",
        error
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      console.log("🔌 QueryRunner liberado.");
    }
  }

  /**
   * Semillas de permisos específicos de admin (con transformación para permissionType y auditResource)
   */
  private async seedPermissions(manager: EntityManager): Promise<void> {
    const permissionRepository = manager.getRepository(PermissionEntity);
    const permissionTypeRepository =
      manager.getRepository(PermissionTypeEntity);
    const auditResourceRepository = manager.getRepository(AuditResourceEntity);

    // 1. Obtener todos los tipos de permiso y audit resources de la BD
    const permissionTypes = await permissionTypeRepository.find();
    const auditResources = await auditResourceRepository.find();

    // 2. Crear mapas de código -> entidad
    const permissionTypeMap = new Map(
      permissionTypes.map((pt) => [pt.code, pt])
    );

    const auditResourceMap = new Map(
      auditResources.map((ar) => [ar.name, ar])
    );

    // 3. Leer data del archivo
    const rawData = SeederUtils.readJsonFile<PermissionSeeder>(
      "admin/permissions.json"
    );

    // 4. Transformar: asignar permissionType, auditResource y quitar códigos
    const transformedData = rawData.map((permission) => {
      const permissionType = permissionTypeMap.get(
        permission.permissionTypeCode
      );

      if (!permissionType) {
        throw new Error(
          `Permission type '${permission.permissionTypeCode}' not found for permission '${permission.code}'`
        );
      }

      let auditResource = null;
      if (permission.auditResourceName) {
        auditResource = auditResourceMap.get(permission.auditResourceName);
        
        if (!auditResource) {
          throw new Error(
            `Audit resource '${permission.auditResourceName}' not found for permission '${permission.code}'`
          );
        }
      }

      const { permissionTypeCode, auditResourceName, ...permissionData } = permission;

      return {
        ...permissionData,
        permissionTypeId: permissionType.id,
        permissionType,
        auditResourceId: auditResource?.id,
        auditResource,
      };
    });

    // 5. Usar el método normal de seeding
    await SeederUtils.seedEntity(
      permissionRepository,
      transformedData,
      "admin permissions"
    );
  }

  /**
   * Semillas de roles específicos de admin (con transformación para permissions y roleType)
   */
  private async seedRoles(manager: EntityManager): Promise<void> {
    const roleRepository = manager.getRepository(RoleEntity);
    const permissionRepository = manager.getRepository(PermissionEntity);
    const roleTypeRepository = manager.getRepository(RoleTypeEntity);

    // 1. Obtener todos los tipos de rol de la BD
    const roleTypes = await roleTypeRepository.find();
    const roleTypeMap = new Map(
      roleTypes.map((rt) => [rt.code, rt])
    );

    // 2. Leer data del archivo
    const rawData = SeederUtils.readJsonFile<RoleSeeder>("admin/roles.json");

    // 3. Transformar: asignar permissions, roleType y quitar códigos
    const transformedData = [];

    for (const roleData of rawData) {
      const existingRole = await roleRepository.findOneBy({ id: roleData.id });

      if (!existingRole) {
        // Buscar role type por código
        const roleType = roleTypeMap.get(roleData.roleTypeCode);
        if (!roleType) {
          throw new Error(
            `Role type '${roleData.roleTypeCode}' not found for role '${roleData.name}'`
          );
        }

        // Buscar permisos por códigos
        const permissions = await permissionRepository.find({
          where: { code: In(roleData.permissionCodes) },
        });

        if (permissions.length !== roleData.permissionCodes.length) {
          const foundCodes = permissions.map((p) => p.code);
          const missingCodes = roleData.permissionCodes.filter(
            (code) => !foundCodes.includes(code)
          );

          throw new Error(
            `Could not find all permissions for role ${roleData.name}. ` +
              `Missing: ${missingCodes.join(", ")}`
          );
        }

        // Quitar códigos y agregar entidades relacionadas
        const { permissionCodes, roleTypeCode, ...entityData } = roleData;

        transformedData.push({
          ...entityData,
          roleTypeId: roleType.id,
          type: roleType,
          permissions,
        });
      }
    }

    // 4. Crear y guardar roles
    for (const roleData of transformedData) {
      const newRole = roleRepository.create(roleData);
      await roleRepository.save(newRole);
    }

    console.log(`-> Seeded ${transformedData.length} admin roles.`);
  }

  private async seedRoleTypes(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(RoleTypeEntity);
    const data = SeederUtils.readJsonFile<RoleType>(
      "admin/role-types.json"
    );
    await SeederUtils.seedEntity(repository, data, "admin role types");
  }

  private async seedAuditResources(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(AuditResourceEntity);
    const data = SeederUtils.readJsonFile<AuditResource>(
      "admin/audit-resources.json"
    );
    await SeederUtils.seedEntity(repository, data, "admin audit resources");
  }
}
