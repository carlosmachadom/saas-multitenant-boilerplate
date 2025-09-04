import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditTablesAndPermissionTypes1756862311068 implements MigrationInterface {
    name = 'AuditTablesAndPermissionTypes1756862311068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission_types" ("id" uuid NOT NULL, "code" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_f1190acea1044ca6f0861867085" UNIQUE ("code"), CONSTRAINT "PK_215b1e2fd4bb5499896fe8edaf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_resources" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, CONSTRAINT "UQ_739704fcf0b6f902d3b23bc0581" UNIQUE ("name"), CONSTRAINT "PK_2ae361e5f50f015d4077a626e72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_actions" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, CONSTRAINT "UQ_1816ea66070e5674de54cf20516" UNIQUE ("name"), CONSTRAINT "PK_3296cfaaa57ea2c20be861b40d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL, "entity_id" uuid NOT NULL, "data" jsonb, "ip_address" inet NOT NULL, "user_agent" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "action_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_62408b952557958fd12867cfeb" ON "audit_logs" ("resource_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96be8397eb45d1f40d84fcb9be" ON "audit_logs" ("action_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd2726fd31b35443f2245b93ba" ON "audit_logs" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2cd10fda8276bb995288acfbfb" ON "audit_logs" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_85c204d8e47769ac183b32bf9c" ON "audit_logs" ("entity_id") `);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "position"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "permission_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_e09e2e301d772d99d93ce84adbe" FOREIGN KEY ("permission_type_id") REFERENCES "permission_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_96be8397eb45d1f40d84fcb9be9" FOREIGN KEY ("action_id") REFERENCES "audit_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_62408b952557958fd12867cfeb6" FOREIGN KEY ("resource_id") REFERENCES "audit_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_62408b952557958fd12867cfeb6"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_96be8397eb45d1f40d84fcb9be9"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_e09e2e301d772d99d93ce84adbe"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "permission_type_id"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "position" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "phone" character varying(20)`);
        await queryRunner.query(`DROP INDEX "IDX_85c204d8e47769ac183b32bf9c"`);
        await queryRunner.query(`DROP INDEX "IDX_2cd10fda8276bb995288acfbfb"`);
        await queryRunner.query(`DROP INDEX "IDX_bd2726fd31b35443f2245b93ba"`);
        await queryRunner.query(`DROP INDEX "IDX_96be8397eb45d1f40d84fcb9be"`);
        await queryRunner.query(`DROP INDEX "IDX_62408b952557958fd12867cfeb"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "audit_actions"`);
        await queryRunner.query(`DROP TABLE "audit_resources"`);
        await queryRunner.query(`DROP TABLE "permission_types"`);
    }

}
