const fs = require("fs");
let code = fs.readFileSync("src/components/AIStudyForum.tsx", "utf-8");

const newFunction = `
  // Trigger AI Discussion Summarization
  const handleGenerateAISummary = async (thread: ForumThread) => {
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/forum/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: thread.id,
          title: thread.title,
          content: thread.content,
          replies: thread.replies,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to summarize thread");
      }
      
      const data = await response.json();
      
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === thread.id) {
            return {
              ...t,
              aiSummary: {
                summary: data.summary,
                keyTakeaways: data.keyTakeaways,
                consensusSolution: data.consensusSolution,
                generatedAt: "Just now",
              },
            };
          }
          return t;
        })
      );
    } catch (error) {
      console.error("Error generating AI summary:", error);
    } finally {
      setIsSummarizing(false);
    }
  };
`;

code = code.replace(/  \/\/ Trigger AI Discussion Summarization[\s\S]*?}, 1200\);\n  };/, newFunction);

fs.writeFileSync("src/components/AIStudyForum.tsx", code);
