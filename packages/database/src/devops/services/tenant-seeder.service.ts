import { DataSource, EntityManager, In } from "typeorm";
import {
  AuditResourceEntity,
  PermissionEntity,
  PermissionTypeEntity,
  RoleEntity,
} from "@core/entities";
import { SeederUtils } from "@devops/services/seeder-utils";
import { BaseSeederService } from "./base-seeder.service";
import { PermissionSeeder, RoleSeeder } from "@devops/services/seeder-types";
import { AuditResource } from "@workspace/contracts";

export class TenantSeederService {
  private readonly dataSource: DataSource;
  private readonly baseSeeder: BaseSeederService;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.baseSeeder = BaseSeederService.getInstance();
  }

  /**
   * Ejecuta el proceso de seeding para la base de datos de tenants dentro de una transacción.
   */
  public async seed(): Promise<void> {
    console.log(
      "--- Iniciando seeding de la base de datos de tenants ---"
    );
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log("🚀 Transacción iniciada.");

      // 1. Semillas compartidas primero
      await this.baseSeeder.seedSharedData(queryRunner.manager);

      // 2. Semillas específicas de tenants
      await this.seedPermissions(queryRunner.manager);
      await this.seedRoles(queryRunner.manager);
      await this.seedAuditResources(queryRunner.manager);

      await queryRunner.commitTransaction();
      console.log(
        "✅ Seeding de tenants completado y transacción confirmada."
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
   * Semillas de permisos específicos de tenants (con transformación para permissionType)
   */
  private async seedPermissions(manager: EntityManager): Promise<void> {
    const permissionRepository = manager.getRepository(PermissionEntity);
    const permissionTypeRepository =
      manager.getRepository(PermissionTypeEntity);

    // 1. Obtener todos los tipos de permiso de la BD
    const permissionTypes = await permissionTypeRepository.find();

    // 2. Crear mapa de código -> entidad
    const permissionTypeMap = new Map(
      permissionTypes.map((pt) => [pt.code, pt])
    );

    // 3. Leer data del archivo
    const rawData = SeederUtils.readJsonFile<PermissionSeeder>(
      "tenants/permissions.json"
    );

    // 4. Transformar: asignar permissionType y quitar permissionTypeCode
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

    // 5. Usar el método normal de seeding
    await SeederUtils.seedEntity(
      permissionRepository,
      transformedData,
      "tenant permissions"
    );
  }

  /**
   * Semillas de roles específicos de tenants (con transformación para permissions)
   */
  private async seedRoles(manager: EntityManager): Promise<void> {
    const roleRepository = manager.getRepository(RoleEntity);
    const permissionRepository = manager.getRepository(PermissionEntity);

    // 1. Leer data del archivo
    const rawData = SeederUtils.readJsonFile<RoleSeeder>("tenants/roles.json");

    // 2. Transformar: asignar permissions y quitar permissionCodes
    const transformedData = [];

    for (const roleData of rawData) {
      const existingRole = await roleRepository.findOneBy({ id: roleData.id });

      if (!existingRole) {
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

        // Quitar permissionCodes y agregar permissions
        const { permissionCodes, ...entityData } = roleData;

        transformedData.push({
          ...entityData,
          permissions,
        });
      }
    }

    // 3. Crear y guardar roles
    for (const roleData of transformedData) {
      const newRole = roleRepository.create(roleData);
      await roleRepository.save(newRole);
    }

    console.log(`-> Seeded ${transformedData.length} tenant roles.`);
  }

  private async seedAuditResources(manager: EntityManager): Promise<void> {
    const repository = manager.getRepository(AuditResourceEntity);
    const data = SeederUtils.readJsonFile<AuditResource>(
      "tenants/audit-resources.json"
    );
    await SeederUtils.seedEntity(repository, data, "tenants audit resources");
  }
}
