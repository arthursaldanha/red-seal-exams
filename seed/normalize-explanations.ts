import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SeedQuestion {
  questionNumber: number;
  block: string;
  task: string;
  taskTitle: string;
  subtask: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanations: Record<string, string>;
}

interface BlockFile {
  block: string;
  blockTitle: string;
  blockDescription?: string;
  totalQuestions: number;
  questions: SeedQuestion[];
}

function normalizeExplanation(text: string): string {
  // Remove "Correct — ", "Incorrect — ", "Correct - ", "Incorrect - " (com diferentes tipos de traço)
  let normalized = text
    .replace(/^Correct\s*[—–-]\s*/i, "")
    .replace(/^Incorrect\s*[—–-]\s*/i, "");

  // Capitaliza a primeira letra
  if (normalized.length > 0) {
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return normalized;
}

function normalizeFile(filePath: string): number {
  const data: BlockFile = JSON.parse(readFileSync(filePath, "utf-8"));
  let changesCount = 0;

  for (const question of data.questions) {
    for (const key of Object.keys(question.explanations)) {
      const original = question.explanations[key];
      const normalized = normalizeExplanation(original);
      if (original !== normalized) {
        question.explanations[key] = normalized;
        changesCount++;
      }
    }
  }

  if (changesCount > 0) {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  return changesCount;
}

// Processar heavy-duty-equipment
const courseDir = join(__dirname, "heavy-duty-equipment");
const files = readdirSync(courseDir).filter((f) => f.endsWith(".json"));

console.log("Normalizando explanations em heavy-duty-equipment...\n");

let totalChanges = 0;
for (const file of files) {
  const filePath = join(courseDir, file);
  const changes = normalizeFile(filePath);
  totalChanges += changes;
  console.log(`  ✓ ${file}: ${changes} alterações`);
}

console.log(`\n✅ Total: ${totalChanges} explanations normalizadas`);
