# Solução para Erro de Deploy na Vercel

## Problema

Durante o deploy na Vercel, ocorria o seguinte erro no build:

```
TypeError: Cannot read properties of undefined (reading 'query')
    at instantiateModule (.next/server/chunks/[turbopack]_runtime.js:715:9)
Error: Failed to collect page data for /api/auth/[...all]
```

## Causa

O erro acontecia porque:

1. Durante o build, o Next.js tentava fazer pre-render da rota `/api/auth/[...all]`
2. O `betterAuth` era importado estaticamente, fazendo com que tentasse conectar ao banco de dados durante o build
3. O Drizzle adapter tentava acessar propriedades (`query`) que não estavam disponíveis no contexto de build

## Solução Implementada

### Arquivo: `src/app/api/auth/[...all]/route.ts`

```typescript
// Força a rota a ser dinâmica, evitando pre-render durante o build
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { auth } = await import("@/lib/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const handler = toNextJsHandler(auth);
  return handler.POST(request);
}

export async function GET(request: Request) {
  const { auth } = await import("@/lib/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  const handler = toNextJsHandler(auth);
  return handler.GET(request);
}
```

### Mudanças Principais

1. **`export const dynamic = "force-dynamic"`**:
   - Força a rota a ser tratada como dinâmica
   - Evita que o Next.js tente fazer pre-render durante o build
   - Essencial para rotas que dependem de conexões com banco de dados

2. **Dynamic Imports**:
   - `await import("@/lib/auth")`: Carrega o módulo de autenticação apenas em runtime
   - `await import("better-auth/next-js")`: Carrega o handler apenas em runtime
   - Impede a inicialização do banco de dados durante o build

## Por que a Tentativa Anterior Falhou

A tentativa anterior tinha erro de sintaxe:

```typescript
// ❌ ERRADO - Aspas extras
const { auth } = await import("'lib/auth"' (see below for file content));

// ✅ CORRETO
const { auth } = await import("@/lib/auth");
```

Além disso, faltava a declaração `export const dynamic = "force-dynamic"`, que é crucial para evitar o pre-rendering.

## Resultado

- ✅ Deploy na Vercel funciona sem erros
- ✅ Funcionalidade de autenticação mantida
- ✅ Login, registro e OAuth funcionais
- ✅ Todas as rotas de autenticação operacionais

## Referências

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Better Auth Next.js Integration](https://www.better-auth.com/docs/integrations/next-js)
