import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad ROLE.
 * Define un conjunto de permisos que pueden ser asignados a los usuarios.
 */
export const RoleSchema = IdentitySchema.extend({
  name: z.string().min(3, 'El nombre del rol debe tener al menos 3 caracteres'),
  description: z.string().optional(),
});

export type Role = z.infer<typeof RoleSchema>;
