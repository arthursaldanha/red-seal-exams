import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { course, block, question, userCourse } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkPlatformAccess } from "@/lib/access-control";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Buscar todos os cursos ativos
    const courses = await db
      .select({
        id: course.id,
        slug: course.slug,
        name: course.name,
        description: course.description,
        price: course.price,
        currency: course.currency,
        isActive: course.isActive,
        createdAt: course.createdAt,
      })
      .from(course)
      .where(eq(course.isActive, true))
      .orderBy(course.name);

    // Para cada curso, contar blocks e questões
    const coursesWithStats = await Promise.all(
      courses.map(async (c) => {
        const blocks = await db
          .select({ id: block.id })
          .from(block)
          .where(eq(block.courseId, c.id));

        const questionCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(question)
          .where(eq(question.courseId, c.id));

        // Verificar se usuário possui este curso
        let hasAccess = false;
        if (session?.user) {
          const purchase = await db
            .select()
            .from(userCourse)
            .where(
              and(
                eq(userCourse.userId, session.user.id),
                eq(userCourse.courseId, c.id)
              )
            )
            .limit(1);
          hasAccess = purchase.length > 0;
        }

        return {
          ...c,
          blockCount: blocks.length,
          questionCount: Number(questionCount[0]?.count ?? 0),
          hasAccess,
        };
      })
    );

    // Informações de acesso do usuário
    let platformAccess = null;
    if (session?.user) {
      platformAccess = await checkPlatformAccess(session.user.id);
    }

    return NextResponse.json({
      courses: coursesWithStats,
      platformAccess,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
