const fs = require("fs");
let code = fs.readFileSync("server.ts", "utf-8");

const summarizeRoute = `
// ================= FORUM SUMMARIZE ENDPOINT ================= //
app.post("/api/forum/summarize", async (req, res) => {
  try {
    const { threadId, title, content, replies } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    const prompt = \`
You are an AI Teaching Assistant moderating a student study forum.
Summarize the following forum thread into a concise set of bullet points, focusing on the core problem, key takeaways, and the consensus solution if one was found.

Thread Title: \${title}
Original Post: \${content}

Replies:
\${replies.map((r, i) => \`[\${i + 1}] \${r.authorName} (\${r.authorRole}): \${r.content}\`).join('\\n')}

Return ONLY a JSON object matching this schema:
{
  "summary": "A 1-2 sentence high-level summary",
  "keyTakeaways": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "consensusSolution": "The accepted or most upvoted solution (if any), otherwise explain what is still unresolved"
}
\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    }
    throw new Error("No output from model");
  } catch (error) {
    console.error("Error summarizing thread:", error);
    res.status(500).json({ error: "Failed to summarize thread" });
  }
});

// ================= VITE / EXPRESS BOOTSTRAP ================= //
`;

code = code.replace("// ================= VITE / EXPRESS BOOTSTRAP ================= //", summarizeRoute);

fs.writeFileSync("server.ts", code);
