import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { question } from "../src/db/schema";

// URLs das branches
const SOURCE_URL =
  "postgresql://neondb_owner:npg_WOqlGMr2yH7m@ep-dark-bread-a4cc1guo-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const DEST_URL =
  "postgresql://neondb_owner:npg_X0HkFlx1OfwW@ep-blue-pine-a49zi9oe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function migrateQuestions() {
  console.log("🔄 Migrando questions...\n");

  // Conexão de origem - buscar todos os dados de uma vez
  const sourcePool = new pg.Pool({ connectionString: SOURCE_URL });
  const sourceDb = drizzle({ client: sourcePool });

  console.log("📥 Buscando questions da origem...");
  const questions = await sourceDb.select().from(question);
  console.log(`   Total: ${questions.length} questions\n`);

  await sourcePool.end();

  // Inserir no destino em batches de 50 (menor para evitar timeout)
  const destPool = new pg.Pool({ connectionString: DEST_URL });
  const destDb = drizzle({ client: destPool });

  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);

    try {
      await destDb.insert(question).values(batch);
      inserted += batch.length;
      console.log(`   ✓ ${inserted}/${questions.length} questions inseridas`);

      // Pequena pausa entre batches para não sobrecarregar
      await sleep(100);
    } catch (error: any) {
      console.error(`   ❌ Erro no batch ${i}-${i + batchSize}:`, error.message);
      // Continua com o próximo batch
    }
  }

  await destPool.end();
  console.log(`\n✅ Migração concluída! ${inserted} questions inseridas.`);
}

migrateQuestions().catch((err) => {
  console.error(err);
  process.exit(1);
});
