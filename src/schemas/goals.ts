import { z } from 'zod'

export const CreateGoalSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title must be at least 1 character long' }),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
})
