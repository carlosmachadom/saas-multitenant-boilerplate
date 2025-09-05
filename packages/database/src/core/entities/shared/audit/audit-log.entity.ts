import { AuditLog } from "@workspace/contracts";
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { UserEntity } from "../auth";
import { AuditActionEntity } from "./audit-action.entity";
import { AuditResourceEntity } from "./audit-resource.entity";

@Entity({ name: "audit_logs" })
@Index(["userId", "createdAt"])
@Index(["resourceId", "actionId"])
@Index(["entityId", "createdAt"])
export class AuditLogEntity implements AuditLog {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "entity_id" })
  entityId: string;

  @Column({ type: "jsonb", nullable: true })
  data: Record<string, any>;

  @Column({ type: "inet", name: "ip_address" })
  ipAddress: string;

  @Column({ type: "text", name: "user_agent" })
  userAgent: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  // --- Foreign Keys ---
  
  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({ type: "uuid", name: "action_id" })
  actionId: string;

  @Column({ type: "uuid", name: "resource_id" })
  resourceId: string;

  // --- Relationships ---
  
  @ManyToOne(() => UserEntity, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => AuditActionEntity, { eager: true })
  @JoinColumn({ name: "action_id" })
  action: AuditActionEntity;

  @ManyToOne(() => AuditResourceEntity, { eager: true })
  @JoinColumn({ name: "resource_id" })
  resource: AuditResourceEntity;
}
