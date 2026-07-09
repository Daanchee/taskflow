import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const sessionResponseSchema = z.object({
  username: z.string(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type SessionResponseDTO = z.infer<typeof sessionResponseSchema>;
