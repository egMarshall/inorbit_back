import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CreateUserSchema, LoginUserSchema } from '../schemas/user'
import { createUser } from '../useCases/users/create-user'
import { loginUser } from '../useCases/users/login-user'

export const userRoutes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        body: CreateUserSchema,
      },
    },
    async request => {
      const { name, email, password } = request.body
      const token = await createUser({ name, email, password })

      return {
        message: 'User created successfully',
        token: token,
      }
    }
  )

  app.post(
    '/users/login',
    {
      schema: {
        body: LoginUserSchema,
      },
    },
    async request => {
      const { email, password } = request.body
      const token = await loginUser({ email, password })

      return {
        message: 'User logged in successfully',
        token: token,
      }
    }
  )
}
