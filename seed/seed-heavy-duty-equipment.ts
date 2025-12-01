import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { init } from "@paralleldrive/cuid2";
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  course,
  block,
  task,
  subtask,
  question,
  type QuestionOption,
} from "../src/db/schema";

config({ path: ".env" });

// Conexão via node-postgres (funciona com proxy Neon local)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });

const createId16 = init({ length: 16 });
const createId24 = init({ length: 24 });

// Tipos do JSON
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
  blockTitle?: string;
  title?: string; // alguns arquivos usam "title" em vez de "blockTitle"
  blockDescription?: string;
  totalQuestions: number;
  questions: SeedQuestion[];
}

async function seedHeavyDutyEquipment() {
  const courseId = createId16();

  // 1. Criar Course
  await db.insert(course).values({
    id: courseId,
    slug: "heavy-duty-equipment",
    name: "Heavy Duty Equipment Technician",
    description: "Red Seal Heavy Duty Equipment Technician Exam Preparation",
    price: 6700,
    currency: "CAD",
    isActive: true,
  });
  console.log(`✓ Course criado: ${courseId}`);

  // 2. Ler arquivos de block em ordem alfabética
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const courseDir = join(__dirname, "heavy-duty-equipment");
  const files = readdirSync(courseDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let blockOrder = 1;
  for (const file of files) {
    const data: BlockFile = JSON.parse(
      readFileSync(join(courseDir, file), "utf-8")
    );

    // 2.1 Criar Block
    const blockId = createId16();
    const blockTitle = data.blockTitle || data.title || "";
    await db.insert(block).values({
      id: blockId,
      courseId,
      code: data.block,
      title: blockTitle,
      description: data.blockDescription ?? null,
      order: blockOrder++,
    });
    console.log(`  ✓ Block ${data.block}: ${blockTitle}`);

    // 2.2 Mapear Tasks e Subtasks únicos
    const tasksMap = new Map<string, { code: string; title: string }>();
    const subtasksMap = new Map<
      string,
      { code: string; title: string; taskCode: string }
    >();

    for (const q of data.questions) {
      if (!tasksMap.has(q.task)) {
        tasksMap.set(q.task, { code: q.task, title: q.taskTitle });
      }

      if (!subtasksMap.has(q.subtask)) {
        const [code, ...rest] = q.subtask.split(" ");
        const title = rest.join(" ");
        const taskCode = code.substring(0, code.lastIndexOf(".")); // "A-1.01" → "A-1"
        subtasksMap.set(q.subtask, { code, title, taskCode });
      }
    }

    // 2.3 Inserir Tasks
    const taskIdMap = new Map<string, string>();
    let taskOrder = 1;
    for (const [taskCode, taskData] of tasksMap) {
      const taskId = createId16();
      taskIdMap.set(taskCode, taskId);
      await db.insert(task).values({
        id: taskId,
        blockId,
        code: taskData.code,
        title: taskData.title,
        order: taskOrder++,
      });
    }
    console.log(`    ✓ ${tasksMap.size} tasks criadas`);

    // 2.4 Inserir Subtasks
    const subtaskIdMap = new Map<string, string>();
    let subtaskOrder = 1;
    for (const [subtaskKey, subtaskData] of subtasksMap) {
      const parentTaskId = taskIdMap.get(subtaskData.taskCode);
      if (!parentTaskId) {
        console.warn(`    ⚠ Task não encontrada para subtask: ${subtaskKey}`);
        continue;
      }
      const subtaskId = createId16();
      subtaskIdMap.set(subtaskKey, subtaskId);
      await db.insert(subtask).values({
        id: subtaskId,
        taskId: parentTaskId,
        code: subtaskData.code,
        title: subtaskData.title,
        order: subtaskOrder++,
      });
    }
    console.log(`    ✓ ${subtasksMap.size} subtasks criadas`);

    // 2.5 Inserir Questions (batch)
    const questionsToInsert = data.questions.map((q) => {
      const opts: QuestionOption[] = ["A", "B", "C", "D"].map((letter, idx) => ({
        id: `opt_${idx + 1}`,
        text: q.options[letter],
        explanation: q.explanations[letter],
        isCorrect: q.correctAnswer === letter,
      }));

      return {
        id: createId24(),
        courseId,
        blockId,
        taskId: taskIdMap.get(q.task) ?? null,
        subtaskId: subtaskIdMap.get(q.subtask) ?? null,
        stem: q.question,
        options: opts,
        isActive: true,
      };
    });

    await db.insert(question).values(questionsToInsert);
    console.log(`    ✓ ${questionsToInsert.length} questões criadas`);
  }

  console.log("\n✅ Seed Heavy Duty Equipment concluído!");
  await pool.end();
}

seedHeavyDutyEquipment().catch((err) => {
  console.error(err);
  pool.end();
  process.exit(1);
});
