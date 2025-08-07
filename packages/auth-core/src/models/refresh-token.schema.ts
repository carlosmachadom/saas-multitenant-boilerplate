import { z } from 'zod';
import { IdentitySchema } from '../base';

/**
 * @description Esquema para la entidad REFRESH_TOKEN.
 * Almacena el token de refresco de larga duración asociado a una sesión.
 */
export const RefreshTokenSchema = IdentitySchema.extend({
  sessionId: z.string().uuid(),
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  revoked: z.boolean().default(false),
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
