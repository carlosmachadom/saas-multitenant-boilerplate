import { z } from "zod";
import { IdentitySchema } from "../../../base";

/**
 * @description Esquema para la entidad AuditResource.
 * Representa un recurso que se puede efectuar en el sistema.
 */
export const AuditResourceSchema = IdentitySchema.extend({
  name: z.string(),
  description: z.string(),
});

export type AuditResource = z.infer<typeof AuditResourceSchema>;
