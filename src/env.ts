import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string().url(),
})

export const env = envSchema.parse(process.env.local)
