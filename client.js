const axios = require("axios");

const { encrypt, decrypt } = require("./crypto");
const {
  semanticTransform,
  reverseSemantic,
  generateMapping,
  encode,
  addNoise,
} = require("./obfuscator");

async function run() {
  // ✅ ONLY ONCE
  const sessionRes = await axios.get("http://localhost:3000/session");

  const sessionId = sessionRes.data.sessionId;
  const mapping = sessionRes.data.mapping;

  console.log("Session:", sessionId);

  const input = "Hello I am hungry";

  const transformed = semanticTransform(input);
  const encoded = encode(transformed, mapping);
  const noisy = addNoise(encoded);
  const encrypted = encrypt(noisy);

  const res = await axios.post("http://localhost:3000/api", {
    ...encrypted,
    sessionId,
  });

  const decrypted = decrypt(res.data.data, res.data.iv);
  const final = reverseSemantic(decrypted);

  console.log("Final:", final);
  console.log("INPUT:", input);
  console.log("TRANSFORMED:", transformed);
  console.log("ENCODED:", encoded);
  console.log("NOISY:", noisy);
}

run();
