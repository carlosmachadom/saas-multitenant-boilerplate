import { z } from "zod";
import { IdentitySchema } from "../../../base";

/**
 * @description Esquema para la entidad AuditAction.
 * Representa una acción que se puede efectuar en el sistema.
 */
export const AuditActionSchema = IdentitySchema.extend({
  name: z.string(),
  description: z.string(),
});

export type AuditAction = z.infer<typeof AuditActionSchema>;
