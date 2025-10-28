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
