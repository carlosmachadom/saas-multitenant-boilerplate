import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad PERMISSION TYPE.
 * Representa el tipo de una acción atómica y específica que un rol puede tener.
 */
export const PermissionTypeSchema = IdentitySchema.extend({
  code: z.string(),
  description: z.string().optional(),
});

export type PermissionType = z.infer<typeof PermissionTypeSchema>;
