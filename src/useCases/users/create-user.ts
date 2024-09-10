import { db } from '../../db'
import { users } from '../../db/schema'
import { hash } from '../../services/hasher-bcrypt'
import { createToken } from '../../services/jwt-token'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

export async function createUser({ name, email, password }: CreateUserRequest) {
  const hashedPassword = await hash(password)

  const result = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning()

  const user = result[0]

  const token = createToken({ userId: user.id })

  return token
}
