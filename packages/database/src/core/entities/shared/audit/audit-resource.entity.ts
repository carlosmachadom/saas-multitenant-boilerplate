import { AuditResource } from "@workspace/contracts";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "audit_resources" })
export class AuditResourceEntity implements AuditResource {
    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { unique: true, length: 100 })
    name: string;

    @Column("varchar", { nullable: true })
    description: string;
}