# Better Auth - Configurações Implementadas

Este arquivo documenta as configurações do Better Auth implementadas no projeto.

## 🚀 Resumo das Implementações

### 1. Autenticação Social

- ✅ Google (já existente)
- ✅ Microsoft (Azure AD)
- ✅ Facebook

### 2. Sistema de E-mail

- ✅ Integração com Resend
- ✅ Templates HTML customizáveis
- ✅ Sistema de substituição de placeholders
- ✅ Suporte para templates locais e URLs

### 3. Integração Stripe

- ✅ Customer Management automático
- ✅ Sistema de assinaturas com 3 planos
- ✅ Webhook handling
- ✅ Período de teste gratuito (Pro - 14 dias)
- ✅ Billing Portal

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

- `src/lib/email-template.ts` - Sistema de templates de e-mail
- `SETUP_GUIDE.md` - Guia completo de configuração
- `.env.example` - Exemplo de variáveis de ambiente
- `auth-schema.ts` - Schema do banco gerado pelo Better Auth

### Arquivos Modificados

- `src/lib/auth.ts` - Configuração principal do Better Auth
- `src/lib/auth-client.ts` - Cliente do Better Auth com plugins
- `package.json` - Dependências adicionadas

## 🔧 Dependências Instaladas

```json
{
  "@better-auth/stripe": "^1.3.30",
  "stripe": "^19.1.0",
  "better-auth": "^1.3.30"
}
```

## ⚙️ Variáveis de Ambiente Necessárias

### Essenciais

```bash
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Autenticação Social

```bash
# Google
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Microsoft
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# Facebook
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

### Stripe Planos

```bash
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_... # Opcional
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_... # Opcional
```

## 📊 Planos Configurados

| Plano      | Projetos | Armazenamento | Período Teste |
| ---------- | -------- | ------------- | ------------- |
| Basic      | 5        | 10GB          | -             |
| Pro        | 20       | 50GB          | 14 dias       |
| Enterprise | ∞        | ∞             | -             |

## 🎯 Como Usar

### Frontend - Autenticação Social

```typescript
import { authClient } from "@/lib/auth-client";

// Microsoft
await authClient.signIn.social({
  provider: "microsoft",
  callbackURL: "/dashboard",
});

// Facebook
await authClient.signIn.social({
  provider: "facebook",
  callbackURL: "/dashboard",
});
```

### Frontend - Assinaturas

```typescript
// Criar assinatura
await authClient.subscription.upgrade({
  plan: "pro",
  annual: true,
  successUrl: "/dashboard?success=true",
  cancelUrl: "/pricing",
});

// Listar assinaturas
const { data: subscriptions } = await authClient.subscription.list();

// Cancelar
await authClient.subscription.cancel({
  returnUrl: "/account",
});

// Billing Portal
const { data } = await authClient.subscription.billingPortal({
  returnUrl: "/account",
});
```

### Backend - Enviar E-mail

```typescript
import {
  sendVerificationEmail,
  sendEmailWithTemplate,
} from "@/lib/email-template";

// E-mail de verificação (automático)
await sendVerificationEmail(user.email, verificationUrl, user.name);

// E-mail customizado
await sendEmailWithTemplate(
  user.email,
  "Assunto",
  "src/templates/meu-template.html",
  {
    name: user.name,
    url: "https://...",
  }
);
```

## 🔄 Próximos Passos

1. Copie `.env.example` para `.env`
2. Configure todas as variáveis de ambiente
3. Execute `npx @better-auth/cli migrate` para criar as tabelas
4. Configure os webhooks do Stripe
5. Configure os callbacks dos providers sociais
6. Teste todas as funcionalidades

## 📖 Documentação Completa

Para instruções detalhadas de configuração, consulte `SETUP_GUIDE.md`.

## 🆘 Suporte

- Better Auth: https://www.better-auth.com/docs
- Stripe Plugin: https://www.better-auth.com/docs/plugins/stripe
- Resend: https://resend.com/docs

## ⚠️ Notas Importantes

1. **Stripe**: O plugin só é carregado se `STRIPE_SECRET_KEY` estiver configurada
2. **E-mails**: Templates são criados automaticamente em `src/templates/`
3. **Trial**: Usuários só podem ter um período de teste por conta (previne abuso)
4. **Webhooks**: Em desenvolvimento local, use o Stripe CLI para testar

## ✅ Funcionalidades Implementadas

- [x] Autenticação social (Microsoft, Facebook, Google)
- [x] Sistema de e-mail com templates HTML
- [x] Integração Stripe completa
- [x] Customer management automático
- [x] Sistema de assinaturas com 3 planos
- [x] Período de teste gratuito
- [x] Webhooks Stripe
- [x] Billing Portal
- [x] Documentação completa
