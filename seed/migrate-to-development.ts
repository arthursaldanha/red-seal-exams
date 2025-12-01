import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { course, block, task, subtask, question } from "../src/db/schema";

// URLs das branches
const SOURCE_URL =
  "postgresql://neondb_owner:npg_WOqlGMr2yH7m@ep-dark-bread-a4cc1guo-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const DEST_URL =
  "postgresql://neondb_owner:npg_X0HkFlx1OfwW@ep-blue-pine-a49zi9oe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function migrate() {
  console.log("🔄 Iniciando migração de dados...\n");

  // Conexões
  const sourcePool = new pg.Pool({ connectionString: SOURCE_URL });
  const destPool = new pg.Pool({ connectionString: DEST_URL });

  const sourceDb = drizzle({ client: sourcePool });
  const destDb = drizzle({ client: destPool });

  try {
    // 1. Migrar Courses
    console.log("📚 Migrando courses...");
    const courses = await sourceDb.select().from(course);
    if (courses.length > 0) {
      await destDb.insert(course).values(courses);
      console.log(`   ✓ ${courses.length} courses migrados`);
    }

    // 2. Migrar Blocks
    console.log("📦 Migrando blocks...");
    const blocks = await sourceDb.select().from(block);
    if (blocks.length > 0) {
      // Inserir em batches de 10
      for (let i = 0; i < blocks.length; i += 10) {
        const batch = blocks.slice(i, i + 10);
        await destDb.insert(block).values(batch);
      }
      console.log(`   ✓ ${blocks.length} blocks migrados`);
    }

    // 3. Migrar Tasks
    console.log("📋 Migrando tasks...");
    const tasks = await sourceDb.select().from(task);
    if (tasks.length > 0) {
      for (let i = 0; i < tasks.length; i += 20) {
        const batch = tasks.slice(i, i + 20);
        await destDb.insert(task).values(batch);
      }
      console.log(`   ✓ ${tasks.length} tasks migradas`);
    }

    // 4. Migrar Subtasks
    console.log("📝 Migrando subtasks...");
    const subtasks = await sourceDb.select().from(subtask);
    if (subtasks.length > 0) {
      for (let i = 0; i < subtasks.length; i += 50) {
        const batch = subtasks.slice(i, i + 50);
        await destDb.insert(subtask).values(batch);
      }
      console.log(`   ✓ ${subtasks.length} subtasks migradas`);
    }

    // 5. Migrar Questions (em batches menores por ser maior)
    console.log("❓ Migrando questions...");
    const questions = await sourceDb.select().from(question);
    if (questions.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        await destDb.insert(question).values(batch);
        const progress = Math.min(i + batchSize, questions.length);
        process.stdout.write(`   Progresso: ${progress}/${questions.length}\r`);
      }
      console.log(`\n   ✓ ${questions.length} questions migradas`);
    }

    console.log("\n✅ Migração concluída com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro na migração:", error);
    throw error;
  } finally {
    await sourcePool.end();
    await destPool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
