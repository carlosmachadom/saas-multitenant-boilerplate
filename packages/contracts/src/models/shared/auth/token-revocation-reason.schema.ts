import { z } from 'zod';
import { IdentitySchema } from '../../../base';

/**
 * @description Esquema para la entidad TOKEN_REVOCATION_REASON.
 * Define las razones por las que un token puede ser revocado.
 */
export const TokenRevocationReasonSchema = IdentitySchema.extend({
  code: z.string(), // ej. 'USER_LOGOUT', 'PASSWORD_CHANGED'
  label: z.string(),
  internalOnly: z.boolean().default(false),
});

export type TokenRevocationReason = z.infer<typeof TokenRevocationReasonSchema>;
