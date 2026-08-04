import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

export function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "7d",
  });
}