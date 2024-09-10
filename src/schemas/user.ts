import { z } from 'zod'

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(5),
})
