import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db/drizzle";
import { user, userCourse } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { registerCoursePurchase } from "@/lib/access-control";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;

        if (!userId || !courseId) {
          console.error("Missing metadata in checkout session:", session.id);
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 }
          );
        }

        // Verificar se já não foi registrado (idempotência)
        const existingPurchase = await db
          .select()
          .from(userCourse)
          .where(
            and(
              eq(userCourse.userId, userId),
              eq(userCourse.courseId, courseId)
            )
          )
          .limit(1);

        if (existingPurchase.length === 0) {
          // Registrar compra
          await registerCoursePurchase(
            userId,
            courseId,
            session.payment_intent as string
          );

          // Atualizar role do usuário para "user" se for "guest"
          const userData = await db
            .select({ role: user.role })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

          if (userData.length > 0 && userData[0].role === "guest") {
            await db
              .update(user)
              .set({ role: "user" })
              .where(eq(user.id, userId));
          }

          console.log(
            `Purchase registered: user=${userId}, course=${courseId}, payment=${session.payment_intent}`
          );
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed:", paymentIntent.id);
        // Pode enviar email de notificação ao usuário aqui
        break;
      }

      default:
        // Ignorar outros eventos
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
