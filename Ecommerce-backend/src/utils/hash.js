// src/utils/hash.js
import bcrypt from "bcrypt";

export async function hashPassword(plain) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plain, saltRounds);
  return hash;
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
