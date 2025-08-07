import { DataSource } from 'typeorm';
import { DevOpsContext } from '../config/devops-context';
import { schemaExists, createSchema } from '../../core/utils/schema.util';
import { devopsAdminConfig, devopsTenantConfig } from '../../core/config/base-config';

export class MigrationRunner {
  async runAdminMigrations(): Promise<void> {
    console.log('📦 Ejecutando migraciones de admin...');
    
    try {
      DevOpsContext.validateConfig();
      const config = DevOpsContext.getConfig();

      const dataSourceOptions = {
        ...devopsAdminConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: 'admin',
        synchronize: false,
        logging: config.logLevel === 'debug',
      };
      
      const dataSource = await new DataSource(dataSourceOptions).initialize();
      
      // Verificar y crear esquema si no existe
      console.log('🔍 Verificando que el esquema \'admin\' existe...');
      if (!(await schemaExists(dataSource, 'admin'))) {
        console.log('📦 Creando esquema \'admin\'...');
        await createSchema(dataSource, 'admin');
        console.log('✅ Esquema \'admin\' creado');
      } else {
        console.log('ℹ️ Esquema \'admin\' ya existe');
      }
      
      await dataSource.runMigrations();
      console.log('✅ Migraciones de admin ejecutadas exitosamente');
      
      await dataSource.destroy();
      
    } catch (error) {
      console.error('❌ Error ejecutando migraciones de admin:', error);
      throw error;
    }
  }
  
  async runTenantMigrations(tenantSchema?: string): Promise<void> {
    const schema = tenantSchema || 'tenant_template';
    console.log(`📦 Ejecutando migraciones de tenant (${schema})...`);
    
    try {
      DevOpsContext.validateConfig();
      const config = DevOpsContext.getConfig();
      
      const dataSourceOptions = {
        ...devopsTenantConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: schema,
        synchronize: false,
        logging: config.logLevel === 'debug',
      };
      
      const dataSource = await new DataSource(dataSourceOptions).initialize();

      // Setear el search_path para que las migraciones se ejecuten en el esquema correcto
      await dataSource.query(`SET search_path TO "${schema}"`);
      
      // Verificar y crear esquema si no existe
      console.log(`🔍 Verificando que el esquema '${schema}' existe...`);
      if (!(await schemaExists(dataSource, schema))) {
        console.log(`📦 Creando esquema '${schema}'...`);
        await createSchema(dataSource, schema);
        console.log(`✅ Esquema '${schema}' creado`);
      } else {
        console.log(`ℹ️ Esquema '${schema}' ya existe`);
      }
      
      await dataSource.runMigrations();
      console.log(`✅ Migraciones de tenant (${schema}) ejecutadas exitosamente`);
      
      await dataSource.destroy();
      
    } catch (error) {
      console.error(`❌ Error ejecutando migraciones de tenant (${schema}):`, error);
      throw error;
    }
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const schemaType = args[0];
  const tenantSchema = args[1];

  if (!schemaType || (schemaType !== 'admin' && schemaType !== 'tenant')) {
    console.error('❌ Error: Argumento inválido');
    console.error('Uso: tsx run-migrations.ts <admin|tenant> [tenant_schema]');
    process.exit(1);
  }

  const runner = new MigrationRunner();
  
  try {
    if (schemaType === 'admin') {
      await runner.runAdminMigrations();
    } else {
      await runner.runTenantMigrations(tenantSchema);
    }
    
    console.log('🎉 Ejecución de migraciones completada exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Error durante la ejecución de migraciones:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
