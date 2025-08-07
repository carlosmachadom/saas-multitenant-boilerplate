import { devopsTenantConfig } from '@core/config';
import { DevOpsContext } from '../config/devops-context';
import { DataSource } from 'typeorm';

export class TenantSeeder {
  async runSeeding(tenantSchema: string): Promise<void> {
    console.log(`🌱 Ejecutando seeds de tenant (${tenantSchema})...`);
    
    try {
      DevOpsContext.validateConfig();
      const config = DevOpsContext.getConfig();
      
      const dataSource = await new DataSource({
        ...devopsTenantConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: tenantSchema,
        synchronize: false,
        logging: true,
      }).initialize();
      
      // Placeholder para seeds de tenant - se implementarán según necesidades
      console.log(`ℹ️ Seeds de tenant para ${tenantSchema} - implementación pendiente`);
      console.log('✅ Seeds de tenant ejecutados exitosamente');
      
      await dataSource.destroy();
    } catch (error) {
      console.error(`❌ Error ejecutando seeds de tenant (${tenantSchema}):`, error);
      throw error;
    }
  }
}

// CLI Entry Point
async function main() {
  const args = process.argv.slice(2);
  const tenantSchema = args[0];

  let schemaName: string;

  if (!tenantSchema) {
    schemaName = 'tenant_template';
  } else {
    schemaName = tenantSchema;
  }
  
  const seeder = new TenantSeeder();
  
  try {
    await seeder.runSeeding(schemaName);
    console.log('🎉 Seeding de tenant completado exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Error durante el seeding de tenant:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
