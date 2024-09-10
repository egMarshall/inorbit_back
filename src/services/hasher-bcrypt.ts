import * as bcrypt from 'bcrypt'

const saltRounds: number = 10

export async function hash(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, saltRounds)
}

export async function compare(
  plaintext: string,
  digest: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, digest)
}
