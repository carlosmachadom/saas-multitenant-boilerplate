import { InitContext } from '@devops/config/init-context';
import { AdminDatabaseService } from '@runtime/services/admin-database.service';
import { TenantDatabaseService } from '@runtime/services/tenant-database.service';
import { schemaExists, createSchema } from '@core/utils/schema.util';
import { DataSource } from 'typeorm';
import { runtimeAdminConfig, runtimeTenantConfig } from '@core/config/base-config';

export class DatabaseInitializer {
  async initializeAdmin(): Promise<void> {
    console.log('🚀 Inicializando esquema admin...');
    
    try {
      const config = InitContext.getConfig();
      
      // Inicializar conexión
      const dataSource = await new DataSource({
        ...runtimeAdminConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: 'admin',
        synchronize: false,
        logging: true,
      }).initialize();
      
      // Crear esquema admin si no existe
      if (!(await schemaExists(dataSource, 'admin'))) {
        await createSchema(dataSource, 'admin');
        console.log('✅ Esquema admin creado');
      } else {
        console.log('ℹ️ Esquema admin ya existe');
      }
      
      // Ejecutar migraciones
      console.log('📦 Ejecutando migraciones admin...');
      await dataSource.runMigrations();
      console.log('✅ Migraciones admin completadas');
      
      // Ejecutar seeds si no se especifica skipSeeding
      if (!config.skipAdminSeeding) {
        console.log('🌱 Ejecutando seeds admin...');
        await this.runAdminSeeds(dataSource);
        console.log('✅ Seeds admin completados');
      } else {
        console.log('⏭️ Seeds admin omitidos');
      }
      
      await dataSource.destroy();
      console.log('✅ Admin inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando admin:', error);
      throw error;
    }
  }

  async initializeTenant(schemaName: string): Promise<void> {
    console.log('🏗️ Inicializando tenant...');
    
    try {
      const config = InitContext.getConfig();
      
      // Inicializar conexión para tenant
      const dataSource = await new DataSource({
        ...runtimeTenantConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: schemaName,
        synchronize: false,
        logging: true,
      }).initialize();
      
      // Crear esquema tenant si no existe
      if (!(await schemaExists(dataSource, schemaName))) {
        await createSchema(dataSource, schemaName);
        console.log(`✅ Esquema ${schemaName} creado`);
      } else {
        console.log(`ℹ️ Esquema ${schemaName} ya existe`);
      }
      
      // Ejecutar migraciones
      console.log(`📦 Ejecutando migraciones tenant para ${schemaName}...`);
      await dataSource.runMigrations();
      console.log(`✅ Migraciones tenant para ${schemaName} completadas`);
      
      // Ejecutar seeds si no se especifica skipSeeding
      if (schemaName === 'tenant_template') {
        if (!config.skipTenantTemplateSeeding) {
          console.log(`🌱 Ejecutando seeds para tenant template...`);
          await this.runTenantSeeds(dataSource, schemaName);
          console.log(`✅ Seeds para tenant template completados`);
        } else {
          console.log(`⏭️ Seeds para tenant template omitidos por configuración`);
        }
      } else {
        console.log(`🌱 Ejecutando seeds para tenant ${schemaName}...`);
        await this.runTenantSeeds(dataSource, schemaName);
        console.log(`✅ Seeds para tenant ${schemaName} completados`);
      }
      
      await dataSource.destroy();
      console.log('✅ Tenant inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando tenant:', error);
      throw error;
    }
  }

  private async runAdminSeeds(dataSource: DataSource): Promise<void> {
    try {
      const { main } = await import('../seeds/run-seeding-admin.js');
      await main(dataSource);
    } catch (error) {
      console.warn('⚠️ No se encontraron seeds de admin o error ejecutándolos:', error);
    }
  }

  private async runTenantSeeds(dataSource: DataSource, schema: string): Promise<void> {
    // Ejecutar seeds básicos de tenant
    try {
      // Aquí se pueden agregar seeds específicos de tenant cuando estén disponibles
      console.log(`ℹ️ Seeds de tenant para ${schema} - implementación pendiente`);
    } catch (error) {
      console.warn(`⚠️ Error ejecutando seeds de tenant para ${schema}:`, error);
    }
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const operation = args[0] || 'full';
  const tenantId = args[1];

  const initializer = new DatabaseInitializer();

  try {
    switch (operation) {
      case 'admin':
        await initializer.initializeAdmin();
        break;
      case 'tenant':

        let schemaName: string;

        if (!tenantId) {
          schemaName = 'tenant_template';
        } else {
          schemaName = tenantId;
        }

        await initializer.initializeTenant(schemaName);
        break;
      case 'full':
        console.log('🔄 Inicialización completa...');
        await initializer.initializeAdmin();
        await initializer.initializeTenant('tenant_template');
        break;
      default:
        console.error(`❌ Operación no válida: ${operation}`);
        console.error('Uso: tsx init-database.ts [admin|tenant|full] [tenant_id]');
        process.exit(1);
    }
    
    console.log('🎉 Inicialización completada exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Error durante la inicialización:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
