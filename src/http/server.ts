import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoal } from '../useCases/goals/create-goal'
import { CreateGoalSchema } from '../schemas/goals'
import { CreateUserSchema, LoginUserSchema } from '../schemas/user'
import { loginUser } from '../useCases/users/login-user'
import { createUser } from '../useCases/users/create-user'
import { verifyToken } from '../services/jwt-token'

const app = Fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server is running on port 3333')
  })
