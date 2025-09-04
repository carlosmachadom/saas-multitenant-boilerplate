// utils/seeder-utils.ts
import * as fs from "fs";
import * as path from "path";
import { Repository } from "typeorm";

export class SeederUtils {
  static readJsonFile<TSeedType>(relativePath: string): TSeedType[] {
    const fullPath = path.join(__dirname, "../seeds/data", relativePath);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContent);
  }

  static async seedEntity<
    TSeedData extends { id: string },
    TEntity extends { id: string },
  >(
    repository: Repository<TEntity>,
    data: TSeedData[],
    entityName: string
  ): Promise<void> {
    console.log(`-> Seeding ${data.length} ${entityName}(s)...`);

    for (const item of data) {
      const existing = await repository.findOneBy({ id: item.id } as any);

      if (!existing) {
        const newEntity = repository.create(item as any);
        await repository.save(newEntity);
      }
    }
  }
}
