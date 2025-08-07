import { z } from 'zod';

/**
 * Esquema para entidades que tienen un identificador único (UUID v4).
 * Este es el bloque de construcción más fundamental.
 */
export const IdentitySchema = z.object({
  id: z.string().uuid('El ID debe ser un UUID válido'),
});
