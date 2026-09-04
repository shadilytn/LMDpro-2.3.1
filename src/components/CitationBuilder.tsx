import React from "react";
import {
  Quote,
  BookOpen,
  Copy,
  Check,
  Save,
  Download,
  Sparkles,
  FileText,
  Bookmark,
  ExternalLink,
  Layers,
  ArrowRight,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Share2
} from "lucide-react";
import { toastService } from "../services/toastService";

export interface CitationMetadata {
  id?: string;
  title: string;
  author: string;
  year?: string | number;
  month?: string;
  journal?: string;
  publisher?: string;
  institution?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  docType?: "journal" | "conference" | "book" | "course" | "spec" | "thesis" | "webpage";
  abstract?: string;
  tags?: string[];
}

export type CitationStyle = "APA" | "MLA" | "Chicago" | "IEEE" | "Harvard" | "BibTeX";

interface CitationBuilderProps {
  initialMetadata?: Partial<CitationMetadata>;
  onSavedToJournal?: (noteId: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

export const CitationBuilder: React.FC<CitationBuilderProps> = ({
  initialMetadata,
  onSavedToJournal,
  onClose,
  compact = false,
}) => {
  const currentYear = new Date().getFullYear();

  const [metadata, setMetadata] = React.useState<CitationMetadata>({
    title: initialMetadata?.title || "Autonomous Multi-Agent Consensus in Cellular Sheaves",
    author: initialMetadata?.author || "Zalamati, A., Nashmi, K., & Petra, S.",
    year: initialMetadata?.year || currentYear,
    month: initialMetadata?.month || "June",
    journal: initialMetadata?.journal || "IEEE Transactions on Autonomous Educational Systems",
    publisher: initialMetadata?.publisher || "LMDpro Academic Publishing",
    institution: initialMetadata?.institution || "Center for Applied Cognitive AI & Topology",
    volume: initialMetadata?.volume || "14",
    issue: initialMetadata?.issue || "3",
    pages: initialMetadata?.pages || "142-159",
    doi: initialMetadata?.doi || "10.1109/TAES.2026.1049281",
    url: initialMetadata?.url || "https://lmdpro.ai/research/sheaf-consensus-2026",
    docType: initialMetadata?.docType || "journal",
    abstract: initialMetadata?.abstract || "",
    tags: initialMetadata?.tags || ["Multi-Agent", "Cellular Sheaves", "ADMM Consensus", "LMDpro"],
  });

  const [selectedStyle, setSelectedStyle] = React.useState<CitationStyle>("APA");
  const [copied, setCopied] = React.useState<boolean>(false);
  const [savedToJournal, setSavedToJournal] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  // Extract first author last name for in-text citations and citekeys
  const firstAuthorLastName = React.useMemo(() => {
    if (!metadata.author) return "Author";
    const cleaned = metadata.author.split(",")[0].trim().split(" ").pop() || "Author";
    return cleaned.replace(/[^a-zA-Z]/g, "");
  }, [metadata.author]);

  // Generate formatted citations for each style
  const formattedCitations = React.useMemo(() => {
    const { title, author, year, journal, publisher, volume, issue, pages, doi, url, docType } = metadata;
    const cleanDoi = doi ? (doi.startsWith("http") ? doi : `https://doi.org/${doi}`) : "";
    const cleanUrl = url || cleanDoi;

    // APA 7th Edition
    const apa = `${author} (${year}). ${title}. ${journal ? `${journal}, ` : ""}${
      volume ? `${volume}` : ""
    }${issue ? `(${issue}), ` : ""}${pages ? `${pages}. ` : ""}${cleanDoi || cleanUrl}`;

    // MLA 9th Edition
    const mla = `${author}. "${title}." ${journal || publisher ? `${journal || publisher}, ` : ""}${
      volume ? `vol. ${volume}, ` : ""
    }${issue ? `no. ${issue}, ` : ""}${year}${pages ? `, pp. ${pages}` : ""}.${
      cleanUrl ? ` ${cleanUrl}.` : ""
    }`;

    // Chicago 17th (Author-Date)
    const chicago = `${author}. ${year}. "${title}." ${journal ? `${journal} ` : ""}${
      volume ? `${volume} ` : ""
    }${issue ? `(${issue}): ` : ""}${pages ? `${pages}. ` : ""}${cleanDoi || cleanUrl}`;

    // Harvard
    const harvard = `${author} ${year}, '${title}', ${journal || publisher || "LMDpro Journal"}, ${
      volume ? `vol. ${volume}, ` : ""
    }${issue ? `no. ${issue}, ` : ""}${pages ? `pp. ${pages}.` : ""}`;

    // IEEE
    const ieee = `[1] ${author}, "${title}," ${journal ? `${journal}, ` : ""}${
      volume ? `vol. ${volume}, ` : ""
    }${issue ? `no. ${issue}, ` : ""}${pages ? `pp. ${pages}, ` : ""}${year}${
      doi ? `, doi: ${doi}.` : "."
    }`;

    // BibTeX
    const citeKey = `${firstAuthorLastName.toLowerCase()}${year}${title
      .split(" ")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")}`;
    
    const entryType = docType === "conference" ? "inproceedings" : docType === "book" ? "book" : "article";
    
    const bibtex = `@${entryType}{${citeKey},
  author    = {${author}},
  title     = {${title}},
  journal   = {${journal || publisher}},
  year      = {${year}},
  volume    = {${volume || ""}},
  number    = {${issue || ""}},
  pages     = {${pages || ""}},
  doi       = {${doi || ""}},
  url       = {${url || ""}}
}`;

    // In-text citation
    const inTextParenthetical = `(${firstAuthorLastName}, ${year})`;
    const inTextNarrative = `${firstAuthorLastName} (${year})`;

    return {
      APA: apa,
      MLA: mla,
      Chicago: chicago,
      Harvard: harvard,
      IEEE: ieee,
      BibTeX: bibtex,
      inTextParenthetical,
      inTextNarrative,
      citeKey,
    };
  }, [metadata, firstAuthorLastName]);

  const activeCitationText = formattedCitations[selectedStyle];

  // Copy to clipboard
  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(activeCitationText);
      setCopied(true);
      toastService.show({
        type: "success",
        title: "Citation Copied",
        message: "Formatted reference copied to clipboard.",
        duration: 2000
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toastService.show({
        type: "warning",
        title: "Copy Failed",
        message: "Failed to copy citation to clipboard.",
      });
    }
  };

  // Save directly to Obsidian Lab Journal Vault
  const handleSaveToLabJournal = () => {
    try {
      const vaultKey = "lmdpro_obsidian_vault";
      const existingVaultRaw = localStorage.getItem(vaultKey);
      let existingNotes: any[] = [];
      if (existingVaultRaw) {
        try {
          existingNotes = JSON.parse(existingVaultRaw);
        } catch {
          existingNotes = [];
        }
      }

      const noteId = `lit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const noteTitle = `Literature: ${metadata.title.slice(0, 50)}`;

      const noteContent = `# ${metadata.title}

> [!CITATION] Formatted Reference (${selectedStyle})
> ${activeCitationText}

## In-Text Citations
- **Parenthetical:** \`${formattedCitations.inTextParenthetical}\`
- **Narrative:** \`${formattedCitations.inTextNarrative}\`
- **BibTeX Cite Key:** \`\\cite{${formattedCitations.citeKey}}\`

## Document Metadata
- **Authors:** ${metadata.author}
- **Year:** ${metadata.year}
- **Publication / Journal:** ${metadata.journal || metadata.publisher || metadata.institution || "N/A"}
- **DOI / URL:** [${metadata.doi || metadata.url || "Link"}](${
        metadata.doi ? (metadata.doi.startsWith("http") ? metadata.doi : `https://doi.org/${metadata.doi}`) : metadata.url
      })
- **Document Type:** \`${metadata.docType || "Academic Paper"}\`
- **Tags:** ${metadata.tags?.map((t) => `#${t.replace(/\s+/g, "_")}`).join(" ") || "#literature #citation"}

## Core Research Notes & Synthesis
- **Primary Hypothesis / Contribution:** 
- **Methodology & Key Equations:** 
- **Experimental Findings:** 
- **Relevance to Current Project / Thesis:** 

---
*Generated via LMDpro Autonomous Citation Builder & RAG KnowledgeBase Engine on ${new Date().toLocaleDateString()}*`;

      const newNote = {
        id: noteId,
        title: noteTitle,
        content: noteContent,
        tags: ["literature", "citation", "research", ...(metadata.tags || [])],
        folder: "Literature & Citations",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to beginning of vault
      const updatedVault = [newNote, ...existingNotes];
      localStorage.setItem(vaultKey, JSON.stringify(updatedVault));

      // Trigger custom window event for real-time vault synchronization across components
      window.dispatchEvent(new CustomEvent("lmdpro_obsidian_vault_updated", { detail: newNote }));

      setSavedToJournal(true);
      toastService.show({
        type: "success",
        title: "Saved to Lab Journal 📓",
        message: `Saved "${metadata.title.slice(0, 30)}..." directly to your literature vault.`,
      });
      onSavedToJournal?.(noteId);

      setTimeout(() => setSavedToJournal(false), 3000);
    } catch (err) {
      console.error("Failed to save citation to Lab Journal:", err);
      toastService.show({
        type: "warning",
        title: "Save Failed",
        message: "Could not save literature note to Lab Journal.",
      });
    }
  };

  // Download .bib or .ris or .md file
  const handleDownloadFile = (format: "bib" | "md" | "ris") => {
    let content = "";
    let filename = "";
    let mimeType = "text/plain";

    if (format === "bib") {
      content = formattedCitations.BibTeX;
      filename = `${formattedCitations.citeKey}.bib`;
    } else if (format === "md") {
      content = `# ${metadata.title}\n\n## Formatted Citation (${selectedStyle})\n${activeCitationText}\n\n## Metadata\n- Author: ${metadata.author}\n- Year: ${metadata.year}\n- Source: ${metadata.journal || metadata.publisher}\n- DOI/URL: ${metadata.doi || metadata.url}`;
      filename = `${formattedCitations.citeKey}.md`;
      mimeType = "text/markdown";
    } else if (format === "ris") {
      content = `TY  - JOUR
TI  - ${metadata.title}
AU  - ${metadata.author}
PY  - ${metadata.year}
JO  - ${metadata.journal || metadata.publisher}
VL  - ${metadata.volume || ""}
IS  - ${metadata.issue || ""}
SP  - ${metadata.pages || ""}
DO  - ${metadata.doi || ""}
UR  - ${metadata.url || ""}
ER  - `;
      filename = `${formattedCitations.citeKey}.ris`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toastService.show({
      type: "info",
      title: "File Exported",
      message: `Exported as ${filename}`,
    });
  };

  return (
    <div className="rounded-3xl bg-[#08151c]/90 border border-[#1b3b4a] backdrop-blur-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143242] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                RAG Academic Engine
              </span>
              <span className="text-[10px] text-[#73A5AD] font-mono">ISO 690 / CrossRef Standard</span>
            </div>
            <h3 className="text-lg font-black text-white">Citation Builder & Lab Journal Sync</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isEditing
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-[#030b10]/60 text-[#73A5AD] border-[#143242] hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Done Editing" : "Edit Metadata"}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Style Selector Tabs */}
      <div className="flex flex-wrap gap-2 items-center bg-[#030b10]/70 p-1.5 rounded-2xl border border-[#143242]">
        {(["APA", "MLA", "Chicago", "IEEE", "Harvard", "BibTeX"] as CitationStyle[]).map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStyle === style
                ? "bg-[#5BC4D4] text-[#030b10] shadow-md shadow-cyan-500/20"
                : "text-[#73A5AD] hover:text-white hover:bg-white/5"
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Formatted Citation Output Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#73A5AD]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Formatted Reference ({selectedStyle} 7th/9th Standard)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadFile("bib")}
              className="text-[11px] text-[#73A5AD] hover:text-cyan-300 transition-colors font-mono"
              title="Download .bib format"
            >
              .BIB
            </button>
            <span>•</span>
            <button
              onClick={() => handleDownloadFile("ris")}
              className="text-[11px] text-[#73A5AD] hover:text-cyan-300 transition-colors font-mono"
              title="Download .ris format"
            >
              .RIS
            </button>
            <span>•</span>
            <button
              onClick={() => handleDownloadFile("md")}
              className="text-[11px] text-[#73A5AD] hover:text-cyan-300 transition-colors font-mono"
              title="Download Markdown card"
            >
              .MD
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#030b10]/90 border border-[#1b3b4a] relative group hover:border-cyan-500/40 transition-all">
          <pre
            className={`font-serif text-sm text-slate-100 whitespace-pre-wrap leading-relaxed select-all ${
              selectedStyle === "BibTeX" ? "font-mono text-xs text-cyan-200" : ""
            }`}
          >
            {activeCitationText}
          </pre>
        </div>

        {/* In-Text Quick Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-[#0a1922] border border-[#143242] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#73A5AD] block font-semibold uppercase">Parenthetical Citation</span>
              <code className="text-xs text-cyan-300 font-mono select-all">
                {formattedCitations.inTextParenthetical}
              </code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(formattedCitations.inTextParenthetical);
                toastService.show({
                  type: "info",
                  title: "In-Text Citation Copied",
                  message: "Parenthetical citation copied to clipboard.",
                  duration: 2000
                });
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0a1922] border border-[#143242] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#73A5AD] block font-semibold uppercase">LaTeX BibTeX Key</span>
              <code className="text-xs text-cyan-300 font-mono select-all">
                \cite{"{"}{formattedCitations.citeKey}{"}"}
              </code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`\\cite{${formattedCitations.citeKey}}`);
                toastService.show({
                  type: "info",
                  title: "Cite Key Copied",
                  message: "LaTeX cite key copied to clipboard.",
                  duration: 2000
                });
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Edit Form (Collapsible) */}
      {isEditing && (
        <div className="p-4 rounded-2xl bg-[#051118] border border-[#143242] space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Document Metadata Fields
            </span>
            <button
              onClick={() => {
                setMetadata({
                  ...metadata,
                  year: new Date().getFullYear(),
                });
              }}
              className="text-[11px] text-[#73A5AD] hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Year
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Document Title</label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Authors (e.g. Smith, J. & Doe, A.)</label>
              <input
                type="text"
                value={metadata.author}
                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Journal / Publisher</label>
              <input
                type="text"
                value={metadata.journal || metadata.publisher}
                onChange={(e) => setMetadata({ ...metadata, journal: e.target.value, publisher: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Year</label>
                <input
                  type="text"
                  value={metadata.year}
                  onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 text-center font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Volume</label>
                <input
                  type="text"
                  value={metadata.volume}
                  onChange={(e) => setMetadata({ ...metadata, volume: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 text-center font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Issue</label>
                <input
                  type="text"
                  value={metadata.issue}
                  onChange={(e) => setMetadata({ ...metadata, issue: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 text-center font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">Pages (e.g. 142-159)</label>
              <input
                type="text"
                value={metadata.pages}
                onChange={(e) => setMetadata({ ...metadata, pages: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">DOI</label>
              <input
                type="text"
                value={metadata.doi}
                onChange={(e) => setMetadata({ ...metadata, doi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#73A5AD] uppercase font-bold">URL / Web Link</label>
              <input
                type="text"
                value={metadata.url}
                onChange={(e) => setMetadata({ ...metadata, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#030b10] border border-[#143242] text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleCopyCitation}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#030b10] border border-[#1b3b4a] hover:border-cyan-400/60 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-[#0a1f2c]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400">Copied Reference!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>Copy Formatted Citation</span>
            </>
          )}
        </button>

        <button
          onClick={handleSaveToLabJournal}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-98"
        >
          {savedToJournal ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Saved to Lab Journal!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-slate-950 fill-current" />
              <span>Save Directly to Lab Journal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
