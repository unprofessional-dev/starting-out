const express = require("express");
const bodyParser = require("body-parser");

const { decrypt, encrypt } = require("./crypto");
const { generateMapping, decode, removeNoise } = require("./obfuscator");

const app = express();
app.use(bodyParser.json());

const sessions = new Map();

// 🔹 Create session
app.get("/session", (req, res) => {
  const id = Math.random().toString(36).substring(2);
  const mapping = generateMapping();

  sessions.set(id, mapping);

  res.json({
    sessionId: id,
    mapping: mapping,
  });
});

// 🔹 Fake provider
function callProvider(text) {
  return `AI_RESPONSE: ${text}`;
}

// 🔹 Main API
app.post("/api", (req, res) => {
  try {
    const { data, iv, sessionId } = req.body;

    const mapping = sessions.get(sessionId);

    if (!mapping) {
      return res.status(400).json({ error: "Invalid session" });
    }

    const decrypted = decrypt(data, iv);
    console.log("DECRYPTED:", decrypted);

    const cleaned = removeNoise(decrypted);
    console.log("CLEANED:", cleaned);

    const decoded = decode(cleaned, mapping);
    console.log("DECODED:", decoded);

    const providerResponse = callProvider(decoded);

    const encrypted = encrypt(providerResponse);

    res.json(encrypted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
