const fs = require("fs");
let code = fs.readFileSync("server.ts", "utf-8");

code = code.replace(
  `    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }`,
  `    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }`
);

fs.writeFileSync("server.ts", code);
