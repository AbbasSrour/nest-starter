import { MigrationInterface, QueryRunner } from "typeorm";

export class default1675243343827 implements MigrationInterface {
    name = 'default1675243343827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_notification_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "first_error" TIMESTAMP, "user_id" uuid, CONSTRAINT "UQ_dc57d0c8b4d68cb246cf0cbd4f6" UNIQUE ("token"), CONSTRAINT "PK_23c61708451d71ae4f59483fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "avatar" character varying, "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_notification_token_entity" ADD CONSTRAINT "FK_17a33ce21c21cf1494d8aca2c70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_notification_token_entity" DROP CONSTRAINT "FK_17a33ce21c21cf1494d8aca2c70"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_notification_token_entity"`);
    }

}
