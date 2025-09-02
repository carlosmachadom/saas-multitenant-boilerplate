import { z } from 'zod';
import { UserSchema } from '../models/shared/auth';

/**
 * @description DTO para el registro de un nuevo usuario.
 * Selecciona los campos necesarios del modelo User y añade la contraseña.
 */
export const RegisterDtoSchema = z.object({
  email: UserSchema.shape.email,
  fullName: z.string().min(2, 'El nombre completo debe tener al menos 2 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

/**
 * @description DTO para el inicio de sesión de un usuario.
 */
export const LoginDtoSchema = z.object({
  email: UserSchema.shape.email,
  password: z.string(),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
