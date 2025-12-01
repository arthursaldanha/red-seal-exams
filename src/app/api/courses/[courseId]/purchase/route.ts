import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db/drizzle";
import { course, userCourse } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId: courseIdOrSlug } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verificar se o curso existe (por ID ou slug)
    let courseData = await db
      .select()
      .from(course)
      .where(eq(course.id, courseIdOrSlug))
      .limit(1);

    if (courseData.length === 0) {
      courseData = await db
        .select()
        .from(course)
        .where(eq(course.slug, courseIdOrSlug))
        .limit(1);
    }

    if (courseData.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseInfo = courseData[0];
    const courseId = courseInfo.id;

    // Verificar se já possui o curso
    const existingPurchase = await db
      .select()
      .from(userCourse)
      .where(
        and(
          eq(userCourse.userId, session.user.id),
          eq(userCourse.courseId, courseId)
        )
      )
      .limit(1);

    if (existingPurchase.length > 0) {
      return NextResponse.json(
        { error: "You already own this course" },
        { status: 400 }
      );
    }

    // Criar Checkout Session do Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: courseInfo.currency.toLowerCase(),
            product_data: {
              name: courseInfo.name,
              description: courseInfo.description ?? undefined,
            },
            unit_amount: courseInfo.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        courseId: courseId,
        courseName: courseInfo.name,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${courseInfo.slug}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${courseInfo.slug}?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
