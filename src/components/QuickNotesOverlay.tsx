import React from "react";
import { X, Save } from "lucide-react";

export const QuickNotesOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const savedNote = localStorage.getItem("quick-note");
    if (savedNote) setNote(savedNote);
  }, []);

  const handleSave = () => {
    localStorage.setItem("quick-note", note);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0c1a24] border border-[#1b3b4a] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-white">Quick Notes</h3>
          <button onClick={() => setIsOpen(false)}>
            <X className="text-[#789cae]" />
          </button>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-48 bg-[#08151c] border border-[#1b3b4a] rounded-2xl p-4 text-white text-sm focus:ring-1 focus:ring-cyan-400 outline-none"
          placeholder="Jot down something..."
        />
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Note
        </button>
      </div>
    </div>
  );
};
