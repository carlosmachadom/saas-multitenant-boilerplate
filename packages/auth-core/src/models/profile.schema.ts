import { z } from 'zod';

/**
 * @description Esquema para la entidad USER_PROFILE.
 * Contiene información personal no sensible del usuario.
 * La PK es el propio user_id para mantener una relación 1:1 estricta.
 */
export const ProfileSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
