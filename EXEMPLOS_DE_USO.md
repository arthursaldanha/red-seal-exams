# Exemplos de Uso - Better Auth

Este arquivo contém exemplos práticos de como usar todas as funcionalidades implementadas.

## 🔐 Autenticação Social

### Componente de Login

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SocialLogin() {
  const handleSocialLogin = async (
    provider: "google" | "microsoft" | "facebook"
  ) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar com</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => handleSocialLogin("google")}
          variant="outline"
          className="w-full"
        >
          Google
        </Button>
        <Button
          onClick={() => handleSocialLogin("microsoft")}
          variant="outline"
          className="w-full"
        >
          Microsoft
        </Button>
        <Button
          onClick={() => handleSocialLogin("facebook")}
          variant="outline"
          className="w-full"
        >
          Facebook
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 💳 Gerenciamento de Assinaturas

### Página de Pricing

```typescript
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "R$ 29",
    description: "Ideal para começar",
    features: ["5 projetos", "10GB de armazenamento", "Suporte por e-mail"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 99",
    description: "Para profissionais",
    trial: "14 dias grátis",
    popular: true,
    features: [
      "20 projetos",
      "50GB de armazenamento",
      "Suporte prioritário",
      "Analytics avançado",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "R$ 299",
    description: "Para empresas",
    features: [
      "Projetos ilimitados",
      "Armazenamento ilimitado",
      "Suporte 24/7",
      "SLA garantido",
      "Onboarding dedicado",
    ],
  },
];

export function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [annualBilling, setAnnualBilling] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
      const { error } = await authClient.subscription.upgrade({
        plan: planId,
        annual: annualBilling,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: window.location.href,
      });

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      console.error("Erro ao criar assinatura:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
        <p className="text-muted-foreground mb-6">
          Selecione o plano ideal para suas necessidades
        </p>

        {/* Toggle anual/mensal */}
        <div className="flex items-center justify-center gap-4">
          <span className={!annualBilling ? "font-bold" : ""}>Mensal</span>
          <button
            onClick={() => setAnnualBilling(!annualBilling)}
            className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors"
            style={{ backgroundColor: annualBilling ? "#007bff" : "" }}
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
              style={{ transform: annualBilling ? "translateX(24px)" : "" }}
            />
          </button>
          <span className={annualBilling ? "font-bold" : ""}>
            Anual <Badge variant="secondary">Economize 20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.popular ? "border-primary shadow-lg" : ""}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.popular && <Badge>Mais Popular</Badge>}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
                {plan.trial && (
                  <Badge variant="outline" className="ml-2">
                    {plan.trial}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {loading === plan.id ? "Carregando..." : "Assinar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard de Assinatura

```typescript
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Subscription = {
  id: string;
  plan: string;
  status: string;
  periodEnd: Date;
  cancelAtPeriodEnd: boolean;
  limits?: {
    projects?: number;
    storage?: number;
  };
};

export function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: subscriptions } = await authClient.subscription.list();
      const active = subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
      );
      setSubscription(active || null);
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;

    try {
      await authClient.subscription.cancel({
        returnUrl: window.location.href,
      });
      loadSubscription();
    } catch (error) {
      console.error("Erro ao cancelar:", error);
    }
  };

  const handleRestoreSubscription = async () => {
    try {
      await authClient.subscription.restore();
      loadSubscription();
    } catch (error) {
      console.error("Erro ao restaurar:", error);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { data } = await authClient.subscription.billingPortal({
        returnUrl: window.location.href,
      });
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro ao abrir portal:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhuma assinatura ativa</CardTitle>
          <CardDescription>
            Assine um plano para começar a usar todos os recursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => (window.location.href = "/pricing")}>
            Ver Planos
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isTrialing = subscription.status === "trialing";
  const isCanceling = subscription.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Plano {subscription.plan}
              {isTrialing && <Badge>Período de Teste</Badge>}
              {isCanceling && <Badge variant="destructive">Cancelando</Badge>}
            </CardTitle>
            <CardDescription>
              {isCanceling
                ? `Sua assinatura será cancelada em ${new Date(
                    subscription.periodEnd
                  ).toLocaleDateString()}`
                : `Próxima cobrança: ${new Date(
                    subscription.periodEnd
                  ).toLocaleDateString()}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.limits && (
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Limites do Plano</h4>
            <ul className="space-y-1 text-sm">
              <li>
                Projetos:{" "}
                {subscription.limits.projects === -1
                  ? "Ilimitado"
                  : subscription.limits.projects}
              </li>
              <li>
                Armazenamento:{" "}
                {subscription.limits.storage === -1
                  ? "Ilimitado"
                  : `${subscription.limits.storage}GB`}
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleManageBilling}>Gerenciar Cobrança</Button>

          {!isCanceling ? (
            <Button onClick={handleCancelSubscription} variant="destructive">
              Cancelar Assinatura
            </Button>
          ) : (
            <Button onClick={handleRestoreSubscription} variant="outline">
              Restaurar Assinatura
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 📧 Sistema de E-mail

### Enviar E-mail Customizado

```typescript
import { sendEmailWithTemplate } from "@/lib/email-template";

// E-mail de boas-vindas
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  await sendEmailWithTemplate(
    userEmail,
    "Bem-vindo ao Pass Red Seal!",
    "src/templates/welcome.html",
    {
      name: userName,
      dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      supportEmail: "suporte@passredseal.com",
      year: new Date().getFullYear().toString(),
    }
  );
}

// E-mail de assinatura criada
export async function sendSubscriptionCreatedEmail(
  userEmail: string,
  planName: string,
  trialDays?: number
) {
  await sendEmailWithTemplate(
    userEmail,
    "Assinatura Confirmada!",
    "src/templates/subscription-created.html",
    {
      planName,
      trialMessage: trialDays
        ? `Você tem ${trialDays} dias de teste grátis!`
        : "",
      dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      year: new Date().getFullYear().toString(),
    }
  );
}

// E-mail de cancelamento
export async function sendSubscriptionCanceledEmail(
  userEmail: string,
  endDate: Date
) {
  await sendEmailWithTemplate(
    userEmail,
    "Assinatura Cancelada",
    "src/templates/subscription-canceled.html",
    {
      endDate: endDate.toLocaleDateString(),
      renewUrl: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      year: new Date().getFullYear().toString(),
    }
  );
}
```

### Template HTML Customizado

```html
<!-- src/templates/welcome.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background-color: #f9f9f9;
        padding: 30px;
        border-radius: 0 0 8px 8px;
      }
      .button {
        display: inline-block;
        background-color: #667eea;
        color: white;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Bem-vindo, {{name}}! 🎉</h1>
    </div>
    <div class="content">
      <p>Estamos muito felizes em ter você conosco!</p>
      <p>
        Sua conta foi criada com sucesso e você já pode começar a usar todas as
        funcionalidades.
      </p>
      <center>
        <a href="{{dashboardUrl}}" class="button">Acessar Dashboard</a>
      </center>
      <p>
        Se tiver alguma dúvida, entre em contato conosco em {{supportEmail}}
      </p>
    </div>
    <div class="footer">
      <p>&copy; {{year}} Pass Red Seal. Todos os direitos reservados.</p>
    </div>
  </body>
</html>
```

## 🔒 Proteção de Rotas

### Middleware para verificar assinatura

```typescript
// src/middleware/subscription.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function requireActiveSubscription(requiredPlans?: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const subscriptions = await auth.api.listActiveSubscriptions({
    query: { referenceId: session.user.id },
    headers: await headers(),
  });

  const activeSubscription = subscriptions?.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  if (!activeSubscription) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  if (requiredPlans && !requiredPlans.includes(activeSubscription.plan)) {
    return NextResponse.redirect(new URL("/pricing?upgrade=true", request.url));
  }

  return { subscription: activeSubscription };
}

// Uso em uma rota API
export async function GET(request: Request) {
  const result = await requireActiveSubscription(["pro", "enterprise"]);

  if (result instanceof NextResponse) {
    return result; // Redirect
  }

  const { subscription } = result;

  // Sua lógica aqui
  return Response.json({ success: true, plan: subscription.plan });
}
```

## 🎨 Hooks Customizados

### useSubscription Hook

```typescript
// src/hooks/use-subscription.ts
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Subscription = {
  id: string;
  plan: string;
  status: string;
  limits?: {
    projects?: number;
    storage?: number;
  };
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubscription = async () => {
    try {
      const { data: subscriptions } = await authClient.subscription.list();
      const active = subscriptions?.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
      );
      setSubscription(active || null);
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const hasFeature = (feature: string) => {
    if (!subscription) return false;

    const limits = subscription.limits;
    if (!limits) return true; // Sem limites = tem tudo

    const limit = limits[feature as keyof typeof limits];
    return limit === -1 || (limit !== undefined && limit > 0);
  };

  const canCreateProject = () => {
    if (!subscription?.limits?.projects) return false;
    return (
      subscription.limits.projects === -1 || subscription.limits.projects > 0
    );
  };

  return {
    subscription,
    loading,
    hasFeature,
    canCreateProject,
    reload: loadSubscription,
  };
}

// Uso no componente
export function MyComponent() {
  const { subscription, loading, canCreateProject } = useSubscription();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Plano: {subscription?.plan || "Nenhum"}</h1>
      {canCreateProject() ? (
        <button>Criar Projeto</button>
      ) : (
        <button onClick={() => (window.location.href = "/pricing")}>
          Upgrade para criar mais projetos
        </button>
      )}
    </div>
  );
}
```

## 🔔 Notificações

### Toast para feedback de ações

```typescript
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function SubscriptionNotifications() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Assinatura criada com sucesso! 🎉");
    }
    if (searchParams.get("upgrade") === "true") {
      toast.info("Faça upgrade do seu plano para acessar este recurso");
    }
  }, [searchParams]);

  return null;
}

// Adicione ao layout
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SubscriptionNotifications />
      {children}
    </>
  );
}
```

Estes exemplos cobrem os casos de uso mais comuns. Para mais detalhes, consulte `SETUP_GUIDE.md`.
