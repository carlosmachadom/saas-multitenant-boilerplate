import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthAndAuditTables1757038402141 implements MigrationInterface {
    name = 'AuthAndAuditTables1757038402141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("user_id" uuid NOT NULL, "full_name" character varying(255), CONSTRAINT "PK_6ca9503d77ae39b4b5a6cc3ba88" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "permission_types" ("id" uuid NOT NULL, "code" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_f1190acea1044ca6f0861867085" UNIQUE ("code"), CONSTRAINT "PK_215b1e2fd4bb5499896fe8edaf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "ip_address" inet, "user_agent" text, "last_access_at" TIMESTAMP WITH TIME ZONE NOT NULL, "session_duration_minutes" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_309cb987cefc47d651a6c8a936" ON "sessions" ("user_id", "is_active", "last_access_at") `);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL, "session_id" uuid NOT NULL, "token" character varying(500) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9113ab1777ded8bca0fecf81a8" ON "refresh_tokens" ("session_id", "revoked", "expires_at") `);
        await queryRunner.query(`CREATE TABLE "role_types" ("id" uuid NOT NULL, "code" character varying(100) NOT NULL, "description" text, CONSTRAINT "UQ_dde0cce6a1277013d8c0e2bce3c" UNIQUE ("code"), CONSTRAINT "PK_31e81d4897da311d67372a5c077" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token_revocation_reasons" ("id" uuid NOT NULL, "code" character varying(50) NOT NULL, "label" character varying(255) NOT NULL, "internal_only" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_cc90b2f4bd7bc50a2c149e3eb11" UNIQUE ("code"), CONSTRAINT "PK_01e81092a0bb4818d1db4ac5b14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token_blacklist" ("id" uuid NOT NULL, "refresh_token_id" uuid NOT NULL, "reason_id" uuid NOT NULL, "blacklisted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3e37528d03f0bd5335874afa48d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_resources" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, CONSTRAINT "UQ_739704fcf0b6f902d3b23bc0581" UNIQUE ("name"), CONSTRAINT "PK_2ae361e5f50f015d4077a626e72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL, "entity_id" uuid NOT NULL, "data" jsonb, "ip_address" inet NOT NULL, "user_agent" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "action_id" uuid NOT NULL, "resource_id" uuid NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ec5508637d45272e4217ed9a91" ON "audit_logs" ("entity_id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5ac06d791bd8df17c808ab1b3" ON "audit_logs" ("resource_id", "action_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f68e345c05e8166ff9deea1ab" ON "audit_logs" ("user_id", "created_at") `);
        await queryRunner.query(`CREATE TABLE "audit_actions" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" character varying, CONSTRAINT "UQ_1816ea66070e5674de54cf20516" UNIQUE ("name"), CONSTRAINT "PK_3296cfaaa57ea2c20be861b40d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL, "code" character varying(100) NOT NULL, "description" text, "permission_type_id" uuid NOT NULL, "audit_resource_id" uuid, CONSTRAINT "UQ_8dad765629e83229da6feda1c1d" UNIQUE ("code"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "description" text, "roleTypeId" uuid NOT NULL, "typeId" uuid, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3bf308fa93da3966f9e76fcfba4" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" ADD CONSTRAINT "FK_92f4a45f756af94f87c99568e9e" FOREIGN KEY ("refresh_token_id") REFERENCES "refresh_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" ADD CONSTRAINT "FK_d06f04c5a8271bc1182476428c2" FOREIGN KEY ("reason_id") REFERENCES "token_revocation_reasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_96be8397eb45d1f40d84fcb9be9" FOREIGN KEY ("action_id") REFERENCES "audit_actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_62408b952557958fd12867cfeb6" FOREIGN KEY ("resource_id") REFERENCES "audit_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_e09e2e301d772d99d93ce84adbe" FOREIGN KEY ("permission_type_id") REFERENCES "permission_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_18edf0c6615318e73fe84ee90b3" FOREIGN KEY ("audit_resource_id") REFERENCES "audit_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_8939398ff2fb0c56864a0574bae" FOREIGN KEY ("typeId") REFERENCES "role_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_8939398ff2fb0c56864a0574bae"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_18edf0c6615318e73fe84ee90b3"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_e09e2e301d772d99d93ce84adbe"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_62408b952557958fd12867cfeb6"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_96be8397eb45d1f40d84fcb9be9"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" DROP CONSTRAINT "FK_d06f04c5a8271bc1182476428c2"`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" DROP CONSTRAINT "FK_92f4a45f756af94f87c99568e9e"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3bf308fa93da3966f9e76fcfba4"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`DROP INDEX "IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "audit_actions"`);
        await queryRunner.query(`DROP INDEX "IDX_2f68e345c05e8166ff9deea1ab"`);
        await queryRunner.query(`DROP INDEX "IDX_b5ac06d791bd8df17c808ab1b3"`);
        await queryRunner.query(`DROP INDEX "IDX_ec5508637d45272e4217ed9a91"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "audit_resources"`);
        await queryRunner.query(`DROP TABLE "token_blacklist"`);
        await queryRunner.query(`DROP TABLE "token_revocation_reasons"`);
        await queryRunner.query(`DROP TABLE "role_types"`);
        await queryRunner.query(`DROP INDEX "IDX_9113ab1777ded8bca0fecf81a8"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP INDEX "IDX_309cb987cefc47d651a6c8a936"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "permission_types"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}
