import Stripe from "stripe";
import { betterAuth } from "better-auth";
import { admin, emailOTP } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { resend } from "@/lib/email";
import { sendVerificationEmail } from "@/lib/email-template";

const stripeClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      // tenant: "common" - Usa o padrão (common) para aceitar contas pessoais e organizacionais
      // tenant: "organizations" - Apenas contas organizacionais
      // tenant: "consumers" - Apenas contas pessoais (Microsoft Account)
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    admin(),
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your Sign In Code"
            : type === "email-verification"
            ? "Verify Your Email"
            : "Reset Your Password";

        const message =
          type === "sign-in"
            ? `Your sign in code is: ${otp}. This code will expire in 5 minutes.`
            : type === "email-verification"
            ? `Your verification code is: ${otp}. This code will expire in 5 minutes.`
            : `Your password reset code is: ${otp}. This code will expire in 5 minutes.`;

        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: email,
          subject,
          html: `<p>${message}</p>`,
        });
      },
      otpLength: 6,
      expiresIn: 600,
      sendVerificationOnSignUp: false,
      overrideDefaultEmailVerification: true,
    }),
    // Stripe plugin - cria customer na Stripe ao cadastrar usuário
    ...(stripeClient
      ? [
          stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            getCustomerCreateParams: async (user) => ({
              email: user.email,
              name: user.name,
              metadata: { userId: user.id },
            }),
          }),
        ]
      : []),
  ],
});
