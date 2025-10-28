# Guia de Configuração - Better Auth com Stripe, Microsoft e Facebook

Este guia descreve como configurar e usar todas as funcionalidades implementadas no seu projeto.

## 📋 O que foi implementado

1. ✅ **Autenticação Social com Microsoft e Facebook**
2. ✅ **Sistema de E-mail com Templates HTML usando Resend**
3. ✅ **Integração completa com Stripe** (Customer Management + Subscriptions)
4. ✅ **Sistema de planos de assinatura** (Basic, Pro, Enterprise)
5. ✅ **Período de teste gratuito** (14 dias no plano Pro)

## 🚀 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 2. Configurar Banco de Dados

Execute as migrations:

```bash
npx @better-auth/cli migrate
```

Ou se preferir usar o Drizzle Kit:

```bash
pnpm drizzle-kit push
```

## 🔐 Configuração da Autenticação Social

### Microsoft (Azure AD)

1. Acesse o [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Clique em "New registration"
3. Configure:
   - **Name**: Nome da sua aplicação
   - **Supported account types**: Escolha uma das opções:
     - "Accounts in any organizational directory and personal Microsoft accounts" (Padrão)
     - "Accounts in this organizational directory only" (Apenas sua organização)
     - "Personal Microsoft accounts only" (Apenas contas pessoais)
4. Em "Redirect URIs", adicione: `http://localhost:3000/api/auth/callback/microsoft`
5. Após criar, copie o "Application (client) ID" para `MICROSOFT_CLIENT_ID`
6. Em "Certificates & secrets", crie um novo client secret e copie para `MICROSOFT_CLIENT_SECRET`

### Facebook

1. Acesse o [Facebook Developers](https://developers.facebook.com/apps)
2. Crie um novo app ou use um existente
3. Configure o Facebook Login:
   - Em "Settings" > "Basic", copie o "App ID" para `FACEBOOK_CLIENT_ID`
   - Copie o "App Secret" para `FACEBOOK_CLIENT_SECRET`
4. Em "Facebook Login" > "Settings", adicione:
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

### Google (já configurado)

Se ainda não configurou, siga os passos similares no [Google Cloud Console](https://console.cloud.google.com/).

## 📧 Configuração do Resend

### 1. Criar conta e obter API Key

1. Acesse [Resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. Vá em "API Keys" e crie uma nova chave
4. Copie a chave para `RESEND_API_KEY` no `.env`

### 2. Configurar domínio (Produção)

Para produção, você precisará verificar seu domínio no Resend:

1. Vá em "Domains" no painel do Resend
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Atualize `EMAIL_FROM` no `.env` com seu domínio verificado

### 3. Usar Templates HTML

O sistema já está configurado para usar templates HTML. Você pode:

**Opção 1: Usar o template padrão**
O template padrão será criado automaticamente em `src/templates/verification-email.html`

**Opção 2: Criar seu próprio template**

```typescript
import { sendEmailWithTemplate } from "@/lib/email-template";

await sendEmailWithTemplate(
  "usuario@example.com",
  "Assunto do E-mail",
  "src/templates/meu-template.html", // ou uma URL
  {
    name: "João",
    url: "https://example.com/verify",
    // ... outros placeholders
  }
);
```

**Opção 3: Usar template de uma URL**

```typescript
await sendEmailWithTemplate(
  "usuario@example.com",
  "Assunto",
  "https://example.com/templates/email.html",
  {
    /* replacements */
  }
);
```

### Placeholders suportados

Use `{{placeholder}}` ou `{placeholder}` no seu template HTML:

```html
<h1>Olá {{name}}!</h1>
<p>Clique no link: {{url}}</p>
```

## 💳 Configuração do Stripe

### 1. Criar conta e obter API Keys

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Vá em "Developers" > "API keys"
3. Copie a "Secret key" (começa com `sk_test_`) para `STRIPE_SECRET_KEY`

### 2. Configurar Webhook

1. No Stripe Dashboard, vá em "Developers" > "Webhooks"
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio.com/api/auth/stripe/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o "Signing secret" (começa com `whsec_`) para `STRIPE_WEBHOOK_SECRET`

### 3. Criar Produtos e Preços

1. No Stripe Dashboard, vá em "Products"
2. Crie 3 produtos (Basic, Pro, Enterprise)
3. Para cada produto, crie os preços:

**Basic**

- Preço mensal → copie o Price ID para `STRIPE_BASIC_PRICE_ID`

**Pro**

- Preço mensal → copie para `STRIPE_PRO_PRICE_ID`
- Preço anual (opcional, com desconto) → copie para `STRIPE_PRO_ANNUAL_PRICE_ID`

**Enterprise**

- Preço mensal → copie para `STRIPE_ENTERPRISE_PRICE_ID`
- Preço anual (opcional) → copie para `STRIPE_ENTERPRISE_ANNUAL_PRICE_ID`

### 4. Testar Webhooks Localmente

Para desenvolvimento local, use o Stripe CLI:

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli#install

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook

# Use o webhook signing secret fornecido no .env
```

## 🎯 Usando as Funcionalidades

### Autenticação Social no Frontend

```typescript
import { authClient } from "@/lib/auth-client";

// Login com Microsoft
await authClient.signIn.social({
  provider: "microsoft",
  callbackURL: "/dashboard",
});

// Login com Facebook
await authClient.signIn.social({
  provider: "facebook",
  callbackURL: "/dashboard",
});

// Login com Google
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});
```

### Gerenciar Assinaturas no Frontend

```typescript
import { authClient } from "@/lib/auth-client";

// Listar assinaturas ativas
const { data: subscriptions } = await authClient.subscription.list();

const activeSubscription = subscriptions?.find(
  (sub) => sub.status === "active" || sub.status === "trialing"
);

// Criar/Atualizar assinatura
await authClient.subscription.upgrade({
  plan: "pro", // ou "basic", "enterprise"
  annual: true, // opcional: plano anual
  successUrl: "/dashboard?success=true",
  cancelUrl: "/pricing",
});

// Verificar limites do plano
const projectLimit = activeSubscription?.limits?.projects || 0;
const storageLimit = activeSubscription?.limits?.storage || 0;

// Cancelar assinatura
await authClient.subscription.cancel({
  returnUrl: "/account",
});

// Restaurar assinatura cancelada
await authClient.subscription.restore();

// Abrir portal de cobrança do Stripe
const { data } = await authClient.subscription.billingPortal({
  returnUrl: "/account",
});

if (data?.url) {
  window.location.href = data.url;
}
```

### Exemplo de Componente de Pricing

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "R$ 29/mês",
    planId: "basic",
    features: ["5 projetos", "10GB armazenamento"],
  },
  {
    name: "Pro",
    price: "R$ 99/mês",
    planId: "pro",
    features: ["20 projetos", "50GB armazenamento", "14 dias grátis"],
  },
  {
    name: "Enterprise",
    price: "R$ 299/mês",
    planId: "enterprise",
    features: ["Projetos ilimitados", "Armazenamento ilimitado"],
  },
];

export function PricingTable() {
  const handleSubscribe = async (planId: string) => {
    const { error } = await authClient.subscription.upgrade({
      plan: planId,
      successUrl: window.location.origin + "/dashboard?success=true",
      cancelUrl: window.location.origin + "/pricing",
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div key={plan.planId} className="border rounded p-6">
          <h3>{plan.name}</h3>
          <p>{plan.price}</p>
          <ul>
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Button onClick={() => handleSubscribe(plan.planId)}>Assinar</Button>
        </div>
      ))}
    </div>
  );
}
```

### Verificar Assinatura no Servidor

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Listar assinaturas do usuário
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: session.user.id,
    },
    headers: await headers(),
  });

  const activeSubscription = subscriptions?.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  return Response.json({ subscription: activeSubscription });
}
```

## 🎨 Customizando Templates de E-mail

### Template de Verificação

O template padrão está em `src/templates/verification-email.html`. Você pode customizá-lo:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Seus estilos personalizados */
    </style>
  </head>
  <body>
    <h1>Olá {{heading}}!</h1>
    <p>{{message}}</p>
    <a href="{{url}}" class="button">{{buttonText}}</a>
    <p>{{appName}} © {{year}}</p>
  </body>
</html>
```

### Criar Novos Templates

```typescript
import { sendEmailWithTemplate } from "@/lib/email-template";

// Template de boas-vindas
await sendEmailWithTemplate(
  user.email,
  "Bem-vindo ao Pass Red Seal!",
  "src/templates/welcome.html",
  {
    name: user.name,
    dashboardUrl: "https://app.example.com/dashboard",
  }
);
```

## 📊 Estrutura do Banco de Dados

As seguintes tabelas foram adicionadas:

### user (atualizada)

- `stripeCustomerId`: ID do cliente no Stripe

### subscription (nova)

- `id`: ID único da assinatura
- `plan`: Nome do plano (basic, pro, enterprise)
- `referenceId`: ID do usuário ou organização
- `stripeCustomerId`: ID do cliente no Stripe
- `stripeSubscriptionId`: ID da assinatura no Stripe
- `status`: Status (active, canceled, trialing, etc.)
- `periodStart`: Início do período de cobrança
- `periodEnd`: Fim do período de cobrança
- `cancelAtPeriodEnd`: Se cancelará no fim do período
- `seats`: Número de assentos (para planos de equipe)
- `trialStart`: Início do período de teste
- `trialEnd`: Fim do período de teste

## 🔧 Troubleshooting

### Erro: "Neither apiKey nor config.authenticator provided"

Certifique-se de que `STRIPE_SECRET_KEY` está configurada no `.env`.

### Webhooks não funcionam localmente

Use o Stripe CLI para forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

### E-mails não são enviados

1. Verifique se `RESEND_API_KEY` está correto
2. Em desenvolvimento, use o domínio `onboarding@resend.dev`
3. Em produção, verifique seu domínio no Resend

## 📚 Recursos Adicionais

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)

## ✅ Checklist de Produção

- [ ] Configurar domínio verificado no Resend
- [ ] Trocar Stripe test keys por live keys
- [ ] Configurar webhook do Stripe em produção
- [ ] Adicionar URLs de callback de produção nos providers sociais
- [ ] Configurar BETTER_AUTH_URL com URL de produção
- [ ] Testar fluxo completo de assinatura
- [ ] Testar cancelamento e restauração
- [ ] Testar período de teste
- [ ] Verificar templates de e-mail em diferentes clientes
