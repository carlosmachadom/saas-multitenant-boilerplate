import { z } from 'zod';
import {
  IdentitySchema,
  TimestampCreationSchema,
} from '../../../base';

/**
 * @description Esquema para la entidad AuditLog.
 * Representa una acción efectuada por un usuario en el sistema.
 */
export const AuditLogSchema = IdentitySchema.merge(TimestampCreationSchema)
  .extend({
    userId: z.string().uuid(),
    actionId: z.string().uuid(),
    resourceId: z.string().uuid(),
    entityId: z.string().uuid(),
    data: z.record(z.any()),
    ipAddress: z.string(),
    userAgent: z.string(),
  });

export type AuditLog = z.infer<typeof AuditLogSchema>;
