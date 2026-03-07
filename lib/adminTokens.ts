import crypto from "crypto";

// HMAC-signed token approach — no server-side state needed.
// The token is: <expiry_timestamp>.<hmac_signature>
// We verify the signature using the ADMIN_PASSWORD as the secret.

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || "fallback-secret";
}

export function createSignedToken(maxAgeSeconds: number): string {
  const expiry = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `admin:${expiry}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function isValidToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  // Verify signature
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  // Check expiry
  const expiryStr = payload.split(":")[1];
  if (!expiryStr) return false;
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry)) return false;
  return Math.floor(Date.now() / 1000) < expiry;
}
