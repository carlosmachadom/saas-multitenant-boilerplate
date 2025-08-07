#!/usr/bin/env node

/**
 * CLI unificado para operaciones de base de datos
 * Punto de entrada para todas las operaciones DevOps
 */

import { program } from 'commander';

program
  .name('db-cli')
  .description('CLI unificado para operaciones de base de datos')
  .version('1.0.0');

// Comando para generar migraciones
program
  .command('migration:generate')
  .description('Generar una nueva migración')
  .argument('<type>', 'Tipo de esquema (admin|tenant)')
  .argument('<name>', 'Nombre de la migración')
  .action(async (type: string, name: string) => {
    const { MigrationGenerator } = await import('../src/devops/cli/generate-migration.js');
    const generator = new MigrationGenerator();
    await generator.generateMigration(type as 'admin' | 'tenant', name);
  });

// Comando para ejecutar migraciones
program
  .command('migration:run')
  .description('Ejecutar migraciones')
  .argument('<type>', 'Tipo de esquema (admin|tenant)')
  .option('-s, --schema <schema>', 'Esquema específico para tenant')
  .action(async (type: string, options: { schema?: string }) => {
    const { MigrationRunner } = await import('../src/devops/cli/run-migrations.js');
    const runner = new MigrationRunner();
    
    if (type === 'admin') {
      await runner.runAdminMigrations();
    } else {
      await runner.runTenantMigrations(options.schema);
    }
  });

// Comando para ejecutar seeds
program
  .command('seed')
  .description('Ejecutar seeds')
  .argument('<type>', 'Tipo de esquema (admin|tenant)')
  .option('-s, --schema <schema>', 'Esquema específico para tenant')
  .action(async (type: string, options: { schema?: string }) => {
    if (type === 'admin') {
      const { AdminSeeder } = await import('../src/devops/cli/seed-admin.js');
      const seeder = new AdminSeeder();
      await seeder.runSeeding();
    } else {
      const { TenantSeeder } = await import('../src/devops/cli/seed-tenant.js');
      const seeder = new TenantSeeder();
      await seeder.runSeeding(options.schema);
    }
  });

// Comando para inicializar base de datos
program
  .command('init')
  .description('Inicializar base de datos')
  .argument('[operation]', 'Operación (admin|tenant-template|tenant|full)', 'full')
  .argument('[tenantId]', 'ID del tenant (solo para operación tenant)')
  .action(async (operation: string, tenantId?: string) => {
    const { DatabaseInitializer } = await import('../src/devops/cli/init-database.js');
    const initializer = new DatabaseInitializer();
    
    switch (operation) {
      case 'admin':
        await initializer.initializeAdmin();
        break;
      case 'tenant-template':
        await initializer.initializeTenantTemplate();
        break;
      case 'tenant':
        if (!tenantId) {
          console.error('❌ Error: Se requiere tenantId para crear tenant específico');
          process.exit(1);
        }
        await initializer.initializeNewTenant(tenantId);
        break;
      case 'full':
        await initializer.initializeAdmin();
        await initializer.initializeTenantTemplate();
        break;
      default:
        console.error(`❌ Operación no válida: ${operation}`);
        process.exit(1);
    }
  });

program.parse();
