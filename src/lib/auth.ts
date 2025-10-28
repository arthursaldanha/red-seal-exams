import Stripe from "stripe";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { resend } from "@/lib/email";
import { sendVerificationEmail } from "@/lib/email-template";

// const stripeClient = process.env.STRIPE_SECRET_KEY
//   ? new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: "2025-09-30.clover",
//     })
//   : null;

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Email Verification",
        html: `Click the link to verify your email: ${url}`,
      });
    },
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
    // ...(stripeClient
    //   ? [
    //       stripe({
    //         stripeClient,
    //         stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
    //         createCustomerOnSignUp: true,
    //         onCustomerCreate: async ({ stripeCustomer, user }) => {
    //           console.log(
    //             `Stripe customer ${stripeCustomer.id} created for user ${user.id}`
    //           );
    //         },
    //         getCustomerCreateParams: async (user) => {
    //           return {
    //             metadata: {
    //               userId: user.id,
    //             },
    //           };
    //         },
    //         subscription: {
    //           enabled: true,
    //           plans: [
    //             {
    //               name: "basic",
    //               priceId: process.env.STRIPE_BASIC_PRICE_ID as string,
    //               limits: {
    //                 projects: 5,
    //                 storage: 10,
    //               },
    //             },
    //             {
    //               name: "pro",
    //               priceId: process.env.STRIPE_PRO_PRICE_ID as string,
    //               annualDiscountPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    //               limits: {
    //                 projects: 20,
    //                 storage: 50,
    //               },
    //               freeTrial: {
    //                 days: 14,
    //                 onTrialStart: async (subscription) => {
    //                   console.log(
    //                     `Trial started for subscription ${subscription.id}`
    //                   );
    //                 },
    //                 onTrialEnd: async ({ subscription }) => {
    //                   console.log(
    //                     `Trial ended for subscription ${subscription.id}`
    //                   );
    //                 },
    //               },
    //             },
    //             {
    //               name: "enterprise",
    //               priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID as string,
    //               annualDiscountPriceId:
    //                 process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
    //               limits: {
    //                 projects: -1,
    //                 storage: -1,
    //               },
    //             },
    //           ],

    //           // Hooks do ciclo de vida da assinatura
    //           onSubscriptionComplete: async ({ subscription, plan }) => {
    //             console.log(
    //               `Subscription completed: ${subscription.id} for plan ${plan.name}`
    //             );
    //           },
    //           onSubscriptionUpdate: async ({ subscription }) => {
    //             console.log(`Subscription updated: ${subscription.id}`);
    //           },
    //           onSubscriptionCancel: async ({ subscription }) => {
    //             console.log(`Subscription canceled: ${subscription.id}`);
    //           },
    //           onSubscriptionDeleted: async ({ subscription }) => {
    //             console.log(`Subscription deleted: ${subscription.id}`);
    //           },
    //         },
    //         // Handler para eventos do webhook Stripe
    //         onEvent: async (event) => {
    //           console.log(`Stripe event received: ${event.type}`);
    //           // Adicione aqui lógica customizada para outros eventos do Stripe
    //         },
    //       }),
    //     ]
    //   : []),
  ],
});
