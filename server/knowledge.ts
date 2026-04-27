import fs from "fs";
import path from "path";

export interface KnowledgeEntry {
  question: string;
  answer: string;
  keywords?: string[];
  category?: string;
}

/**
 * Load all knowledge files from the ./knowledge directory.
 * Supports .json, .txt, and .md files.
 */
export function knowledgeLoader(): KnowledgeEntry[] {
  const knowledgeDir = path.resolve(process.cwd(), "knowledge");
  const entries: KnowledgeEntry[] = [];

  if (!fs.existsSync(knowledgeDir)) {
    console.warn("⚠️  No ./knowledge directory found. AI will respond without context.");
    return entries;
  }

  const files = fs.readdirSync(knowledgeDir);

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    const ext = path.extname(file).toLowerCase();

    try {
      if (ext === ".json") {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const items: KnowledgeEntry[] = Array.isArray(data) ? data : data.entries || [];
        entries.push(...items);
      } else if (ext === ".txt" || ext === ".md") {
        // Parse text/markdown files: treat entire file as one knowledge entry
        const content = fs.readFileSync(filePath, "utf-8").trim();
        if (content) {
          entries.push({
            question: path.basename(file, ext).replace(/[-_]/g, " "),
            answer: content,
            keywords: extractKeywords(content),
          });
        }
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err);
    }
  }

  console.log(`📚 Loaded ${entries.length} knowledge entries from ${files.length} files`);
  return entries;
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction: get unique words > 4 chars, up to 20 keywords
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);

  return [...new Set(words)].slice(0, 20);
}
