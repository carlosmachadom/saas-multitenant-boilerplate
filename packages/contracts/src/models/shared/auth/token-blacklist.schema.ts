import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad TOKEN_BLACKLIST.
 * Registra un token de refresco que ha sido invalidado antes de su expiración.
 */
export const TokenBlacklistSchema = IdentitySchema.extend({
  refreshTokenId: z.string().uuid(),
  reasonId: z.string().uuid(),
  blacklistedAt: z.date(),
});

export type TokenBlacklist = z.infer<typeof TokenBlacklistSchema>;
