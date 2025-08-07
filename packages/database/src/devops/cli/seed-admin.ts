import { devopsAdminConfig } from "@core/config";
import { DevOpsContext } from "../config/devops-context";
import { DataSource } from "typeorm";

export class AdminSeeder {
  async runSeeding(): Promise<void> {
    console.log("🌱 Ejecutando seeds de admin...");

    try {
      DevOpsContext.validateConfig();

      const config = DevOpsContext.getConfig();

      const dataSource = await new DataSource({
        ...devopsAdminConfig,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        schema: "admin",
        synchronize: false,
        logging: true,
      }).initialize();

      // Importar y ejecutar el seeding existente
      const { main } = await import("../seeds/run-seeding-admin.js");
      await main(dataSource);

      await dataSource.destroy();

      console.log("✅ Seeds de admin ejecutados exitosamente");
    } catch (error) {
      console.error("❌ Error ejecutando seeds de admin:", error);
      throw error;
    }
  }
}

// CLI Entry Point
async function main() {
  const seeder = new AdminSeeder();

  try {
    await seeder.runSeeding();
    console.log("🎉 Seeding de admin completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("💥 Error durante el seeding de admin:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
