import { z } from 'zod';
import {
  IdentitySchema,
  TimestampsSchema,
  SoftDeleteSchema,
  StatusSchema,
} from '../../../base';

/**
 * @description Esquema para la entidad USER.
 * Representa un usuario en el sistema, que puede ser un humano o una cuenta de servicio.
 * Se construye componiendo esquemas base para máxima reutilización y consistencia.
 */
export const UserSchema = IdentitySchema.merge(TimestampsSchema)
  .merge(SoftDeleteSchema)
  .merge(StatusSchema)
  .extend({
    email: z.string().email('El correo electrónico proporcionado no es válido'),
    password: z.string(), // Este campo almacenará el hash de la contraseña
  });

export type User = z.infer<typeof UserSchema>;
