// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // On ne gère le CORS que pour les routes API
  if (request.nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") ?? "*";

    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin"); // évite les problèmes de cache
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Répondre directement aux préflight OPTIONS
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
