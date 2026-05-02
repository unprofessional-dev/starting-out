// 🔹 Semantic transform
function semanticTransform(text) {
  return text
    .toLowerCase()
    .replace(/hello/g, "GRT1")
    .replace(/how are you/g, "STAT?")
    .replace(/hungry/g, "HL9")
    .replace(/i am (.*)/g, "STATE:$1");
}

// 🔹 Reverse semantic
function reverseSemantic(text) {
  return text
    .replace(/GRT1/g, "hello")
    .replace(/STAT\?/g, "how are you")
    .replace(/HL9/g, "hungry")
    .replace(/STATE:(.*)/g, "i am $1");
}

// 🔹 Dynamic mapping
function generateMapping() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const shuffled = chars.split("").sort(() => Math.random() - 0.5);

  let map = {};
  chars.split("").forEach((c, i) => {
    map[c] = shuffled[i] + Math.floor(Math.random() * 10);
  });

  return map;
}

// 🔹 Encode
function encode(text, map) {
  return text
    .toUpperCase()
    .split("")
    .map(c => map[c] || c)
    .join("");
}

// 🔹 Decode
function decode(encoded, map) {
  const reverseMap = Object.fromEntries(
    Object.entries(map).map(([k, v]) => [v, k])
  );

  let result = "";
  let buffer = "";

  for (let char of encoded) {
    buffer += char;
    if (reverseMap[buffer]) {
      result += reverseMap[buffer];
      buffer = "";
    }
  }

  return result;
}

// 🔹 Noise
function addNoise(text) {
  const noise = "#@$%!*";
  let result = "";

  for (let char of text) {
    result += char;
    if (Math.random() < 0.3) {
      result += noise[Math.floor(Math.random() * noise.length)];
    }
  }

  return result;
}

function removeNoise(text) {
  return text.replace(/[#@$%!*]/g, "");
}

module.exports = {
  semanticTransform,
  reverseSemantic,
  generateMapping,
  encode,
  decode,
  addNoise,
  removeNoise,
};