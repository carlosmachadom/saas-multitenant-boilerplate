import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad PERMISSION.
 * Representa una acción atómica y específica que un rol puede tener.
 */
export const PermissionSchema = IdentitySchema.extend({
  code: z.string(), // ej. 'users:create', 'invoices:read'
  description: z.string().optional(),
  permissionTypeId: z.string().uuid(),
  auditResourceId: z.string().uuid().optional(),
});

export type Permission = z.infer<typeof PermissionSchema>;
