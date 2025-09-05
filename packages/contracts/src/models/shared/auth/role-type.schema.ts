import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad ROLE TYPE.
 * Representa el tipo de que un rol puede tener.
 */
export const RoleTypeSchema = IdentitySchema.extend({
  code: z.string(),
  description: z.string().optional(),
});

export type RoleType = z.infer<typeof RoleTypeSchema>;
