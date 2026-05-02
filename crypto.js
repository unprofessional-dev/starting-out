const crypto = require("crypto");

const algorithm = "aes-256-cbc";

// 🔑 global base key (we’ll improve later)
const baseKey = crypto.createHash("sha256").update("super_secret_key").digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, baseKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    data: encrypted,
    iv: iv.toString("hex"),
  };
}

function decrypt(data, ivHex) {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, baseKey, iv);

  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };