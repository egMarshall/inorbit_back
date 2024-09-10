import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { compare } from '../../services/hasher-bcrypt'
import { createToken } from '../../services/jwt-token'

interface LoginUserRequest {
  email: string
  password: string
}

export async function loginUser({ email, password }: LoginUserRequest) {
  const user = await db.select().from(users).where(eq(users.email, email))

  if (!user[0]) {
    throw new Error('User not found')
  }

  const passwordMatch = await compare(password, user[0].password)

  if (!passwordMatch) {
    throw new Error('Invalid password')
  }

  const token = createToken({ userId: user[0].id })

  return token
}
