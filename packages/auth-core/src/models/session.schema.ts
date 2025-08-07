import { z } from 'zod';
import { IdentitySchema, StatusSchema } from '../base';

/**
 * @description Esquema para la entidad SESSION.
 * Registra un inicio de sesión de un usuario desde un dispositivo/navegador específico.
 */
export const SessionSchema = IdentitySchema.merge(StatusSchema).extend({
  userId: z.string().uuid(),
  userAgent: z.string().nullable(),
  ipAddress: z
    .string()
    .ip({ message: 'La dirección IP no es válida' })
    .nullable(),
  createdAt: z.date(),
  lastAccessAt: z.date(),
  sessionDurationMinutes: z.number().int(),
});

export type Session = z.infer<typeof SessionSchema>;
