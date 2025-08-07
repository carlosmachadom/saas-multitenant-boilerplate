import { DataSource, EntityManager, In } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { PermissionEntity, RoleEntity, TokenRevocationReasonEntity } from '@core/entities';


// Tipos para los datos de los archivos JSON
interface PermissionData {
  id: string;
  code: string;
  description: string;
}

interface RoleData {
  id: string;
  name: string;
  description: string;
  permissionCodes: string[];
}

interface TokenRevocationReasonData {
  id: string;
  code: string;
  label: string;
  internalOnly: boolean;
}

export class AdminSeederService {
  private readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  /**
   * Ejecuta el proceso de seeding para la base de datos de administración dentro de una transacción.
   */
  public async seed(): Promise<void> {
    console.log('--- Iniciando seeding de la base de datos de administración ---');
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('🚀 Transacción iniciada.');
      await this.seedPermissions(queryRunner.manager);
      await this.seedRoles(queryRunner.manager);
      await this.seedTokenRevocationReasons(queryRunner.manager);

      await queryRunner.commitTransaction();
      console.log('✅ Seeding de administración completado y transacción confirmada.');
    } catch (error) {
      console.error('❌ Error durante el seeding. Revirtiendo la transacción...', error);
      await queryRunner.rollbackTransaction();
      throw error; // Re-lanzar para que el proceso principal falle
    } finally {
      await queryRunner.release();
      console.log('🔌 QueryRunner liberado.');
    }
  }

  /**
   * Carga y persiste los permisos desde el archivo JSON.
   */
  private async seedPermissions(manager: EntityManager): Promise<void> {
    const permissionRepository = manager.getRepository(PermissionEntity);
    const permissionsPath = path.join(
      __dirname,
      '../seeds/data/admin/permissions.json',
    );
    const permissionsFile = fs.readFileSync(permissionsPath, 'utf8');
    const permissionsData: PermissionData[] = JSON.parse(permissionsFile);

    console.log(`-> Found ${permissionsData.length} permissions in the file.`);

    for (const permissionData of permissionsData) {
      const existingPermission = await permissionRepository.findOneBy({
        id: permissionData.id,
      });

      if (!existingPermission) {
        const newPermission = permissionRepository.create(permissionData);
        await permissionRepository.save(newPermission);
      }
    }
  }

  /**
   * Carga y persiste los roles desde el archivo JSON.
   */
  private async seedRoles(manager: EntityManager): Promise<void> {
    const roleRepository = manager.getRepository(RoleEntity);
    const permissionRepository = manager.getRepository(PermissionEntity);
    const rolesPath = path.join(__dirname, '../seeds/data/admin/roles.json');
    const rolesFile = fs.readFileSync(rolesPath, 'utf8');
    const rolesData: RoleData[] = JSON.parse(rolesFile);

    console.log(`-> Found ${rolesData.length} roles in the file.`);

    for (const roleData of rolesData) {
      const existingRole = await roleRepository.findOneBy({ id: roleData.id });

      if (!existingRole) {
        const permissions = await permissionRepository.find({
          where: { code: In(roleData.permissionCodes) },
        });

        if (permissions.length !== roleData.permissionCodes.length) {
          throw new Error(
            `Could not find all permissions for role ${roleData.name}`,
          );
        }

        const newRole = roleRepository.create({
          ...roleData,
          permissions,
        });
        await roleRepository.save(newRole);
      }
    }
  }

  /**
   * Carga y persiste las razones de revocación de tokens desde el archivo JSON.
   */
  private async seedTokenRevocationReasons(manager: EntityManager): Promise<void> {
    const tokenRevocationReasonRepository = manager.getRepository(TokenRevocationReasonEntity);
    const reasonsPath = path.join(
      __dirname,
      '../seeds/data/shared/token-revocation-reasons.json',
    );
    const reasonsFile = fs.readFileSync(reasonsPath, 'utf8');
    const reasonsData: TokenRevocationReasonData[] = JSON.parse(reasonsFile);

    console.log(`-> Found ${reasonsData.length} token revocation reasons.`);

    for (const reasonData of reasonsData) {
      const existingReason = await tokenRevocationReasonRepository.findOneBy({
        id: reasonData.id,
      });

      if (!existingReason) {
        const newReason = tokenRevocationReasonRepository.create(reasonData);
        await tokenRevocationReasonRepository.save(newReason);
      }
    }
  }
}
