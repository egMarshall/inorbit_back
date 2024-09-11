import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateGoalSchema } from '../schemas/goals'
import { verifyToken } from '../services/jwt-token'
import { createGoal } from '../useCases/goals/create-goal'
import { getWeekPendingGoals } from '../useCases/goals/get-pending-goals'
import z from 'zod'
import { addGoalCompletion } from '../useCases/goals/add-goal-completion'
import { getWeekSummary } from '../useCases/goals/get-week-summary'

export const goalsRoutes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: CreateGoalSchema,
      },
    },
    async request => {
      const authorization = request.headers.authorization
      if (!authorization) {
        throw new Error('Authorization header is missing')
      }
      const requestData = verifyToken(authorization)

      const userId = requestData.data.userId

      const { title, desiredWeeklyFrequency } = request.body
      await createGoal({
        title,
        desiredWeeklyFrequency,
        userId,
      })

      return {
        message: 'Goal created successfully',
      }
    }
  )

  app.get('/pending-goals', async request => {
    const authorization = request.headers.authorization
    if (!authorization) {
      throw new Error('Authorization header is missing')
    }
    const requestData = verifyToken(authorization)

    const userId = requestData.data.userId
    const pendingGoals = await getWeekPendingGoals({ userId })

    return pendingGoals
  })

  app.post(
    '/goal-completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const authorization = request.headers.authorization
      if (!authorization) {
        throw new Error('Authorization header is missing')
      }
      const requestData = verifyToken(authorization)

      const userId = requestData.data.userId

      const { goalId } = request.body

      await addGoalCompletion({
        goalId,
      })

      return {
        message: 'Completion added successfully to goal',
      }
    }
  )

  app.get('/goals-summary', async request => {
    const authorization = request.headers.authorization
    if (!authorization) {
      throw new Error('Authorization header is missing')
    }
    const requestData = verifyToken(authorization)

    const userId = requestData.data.userId

    const weekSummary = await getWeekSummary({ userId })

    return weekSummary
  })
}
