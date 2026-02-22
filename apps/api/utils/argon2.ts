import * as argon2 from 'argon2';

export async function hashPassword(password: string) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: 32,
    memoryCost: 2 ** 16,
    timeCost: 4,
    parallelism: 4,
  });
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
) {
  return await argon2.verify(hashedPassword, plainPassword);
}