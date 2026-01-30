import crypto from "crypto"

/**
 * Generate a secure random admin token
 */
export function generateAdminToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Validate admin token from cookie
 */
export function validateAdminToken(cookieToken: string | undefined): boolean {
  if (!cookieToken) return false

  // Check if token exists and matches expected format (64 hex characters)
  const tokenRegex = /^[a-f0-9]{64}$/
  return tokenRegex.test(cookieToken)
}

/**
 * Hash token for secure comparison
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}
