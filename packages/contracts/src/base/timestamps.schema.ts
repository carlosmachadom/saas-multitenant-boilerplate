import { z } from "zod";

/**
 * Esquema para entidades que tienen marcas de tiempo de creación.
 */
export const TimestampCreationSchema = z.object({
  createdAt: z.date(),
});

/**
 * Esquema para entidades que tienen marcas de tiempo de creación y actualización.
 */
export const TimestampsSchema = TimestampCreationSchema.merge(
  TimestampCreationSchema
).extend({
  updatedAt: z.date(),
});

/**
 * Esquema para entidades que soportan borrado lógico (soft delete).
 */
export const SoftDeleteSchema = z.object({
  deletedAt: z.date().nullable(),
});
