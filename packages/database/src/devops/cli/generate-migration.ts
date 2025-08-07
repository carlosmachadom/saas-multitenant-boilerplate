import { DevOpsContext } from "../config/devops-context";
import { DataSource } from "typeorm";
import {
  devopsAdminConfig,
  devopsTenantConfig,
} from "../../core/config/base-config";
import { schemaExists, createSchema } from "../../core/utils/schema.util";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export class MigrationGenerator {
  async generateMigration(
    schemaType: "admin" | "tenant",
    migrationName: string,
  ): Promise<void> {
    console.log(`📝 Generando migración para ${schemaType}: ${migrationName}`);

    try {
      DevOpsContext.validateConfig();
      const config = DevOpsContext.getConfig();

      const migrationRelative = `src/devops/migrations/${schemaType}/${migrationName}`;
      const datasourcePath = `src/devops/config/${schemaType}-cli.datasource.ts`;

      await this.ensureSchemaExists(schemaType, config);

      const command = `typeorm-ts-node-commonjs -d "${datasourcePath}" migration:generate "${migrationRelative}"`;
      console.log(`🔧 Ejecutando comando TypeORM...`);

     try {
        await execSync(command, {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: "pipe",
        });
      } catch (execError: any) {
        console.error("❌ Error ejecutando comando TypeORM:", execError.message);
        if (execError.stdout) console.log("STDOUT:", execError.stdout);
        if (execError.stderr) console.error("STDERR:", execError.stderr);
        throw execError;
      }

      const actualFile = await this.findGeneratedFile(migrationName, schemaType);
      await this.cleanMigrationFile(actualFile);
      console.log(`🎉 Migración generada y limpiada exitosamente`);
      
    } catch (error) {
      console.error(`❌ Error generando migración para ${schemaType}:`, error);
      throw error;
    }
  }

  private async findGeneratedFile(migrationName: string, schemaType: string): Promise<string> {
    try {
      const searchResult = execSync(
        `find "${process.cwd()}" -name "*${migrationName}*" -type f`, 
        { encoding: "utf8" }
      );
      
      const foundFiles = searchResult.trim().split('\n').filter(f => f && f.endsWith('.ts'));
      
      if (foundFiles.length === 0) {
        throw new Error(`No se encontró archivo para migración: ${migrationName}`);
      }
      
      const expectedDirPart = `src/devops/migrations/${schemaType}`;
      const correctFile = foundFiles.find(f => f.includes(expectedDirPart));
      
      if (!correctFile) {
        throw new Error(`No se encontró archivo para migración: ${migrationName}`);
      }
      
      return correctFile;
    } catch (findError) {
      // Fallback: buscar en el directorio esperado
      const expectedDir = path.join(process.cwd(), `src/devops/migrations/${schemaType}`);
      if (fs.existsSync(expectedDir)) {
        const files = fs.readdirSync(expectedDir);
        const matchingFiles = files.filter(f => f.includes(migrationName) && f.endsWith('.ts'));
        
        if (matchingFiles.length > 0) {
          const firstMatch = matchingFiles[0];
          if (firstMatch) {
            return path.join(expectedDir, firstMatch);
          }
        }
      }
      
      throw new Error(`No se pudo encontrar el archivo de migración: ${migrationName}`);
    }
  }

  private async ensureSchemaExists(
    schemaType: "admin" | "tenant",
    config: any,
  ): Promise<void> {
    const schemaName = schemaType === "admin" ? "admin" : "tenant_template";
    const baseConfig = schemaType === "admin" ? devopsAdminConfig : devopsTenantConfig;

    const dataSource = new DataSource({
      ...baseConfig,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      schema: schemaName,
      synchronize: false,
      logging: false,
    });

    try {
      await dataSource.initialize();

      if (!(await schemaExists(dataSource, schemaName))) {
        console.log(`📦 Creando esquema '${schemaName}'...`);
        await createSchema(dataSource, schemaName);
      }
    } finally {
      await dataSource.destroy();
    }
  }

  private async cleanMigrationFile(filePath: string): Promise<void> {
    try {
      const fsPromises = await import("fs/promises");
      let content = await fsPromises.readFile(filePath, "utf8");

      content = content
        .replace(/(public\.|`public`\.|"public"\.)/g, "")
        .replace(/(tenant_template\.|`tenant_template`\.|"tenant_template"\.)/g, "")
        .replace(/(admin\.|`admin`\.|"admin"\.)/g, "")
        .replace(
          /SET (search_path|search\s*\(\s*['"]search_path['"]\s*,\s*['"][^'"]+['"]\s*,\s*true\s*\))\s*=\s*['"][^'"]+['"]/g,
          "// $&  // Comentado para permitir configuración dinámica",
        );

      await fsPromises.writeFile(filePath, content, "utf8");
    } catch {
      console.warn("⚠️ No se pudo limpiar automáticamente las referencias al esquema");
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const schemaType = args[0] as "admin" | "tenant";
  const migrationName = args[1];

  if (!schemaType || !migrationName) {
    console.error("❌ Uso: tsx generate-migration.ts <admin|tenant> <Nombre>");
    process.exit(1);
  }

  if (schemaType !== "admin" && schemaType !== "tenant") {
    console.error('❌ El primer argumento debe ser "admin" o "tenant".');
    process.exit(1);
  }

  const generator = new MigrationGenerator();
  try {
    await generator.generateMigration(schemaType, migrationName);
    console.log("🎉 Generación completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("💥 Error durante la generación:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
