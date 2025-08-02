import crypto from "crypto"
import jwt from "jsonwebtoken"


function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function generateTransactionId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export { generateToken, hashPassword,generateTransactionId };