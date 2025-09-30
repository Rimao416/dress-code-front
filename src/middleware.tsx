import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ou mets ton domaine exact
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(req: Request) {
  // ta logique
  return new NextResponse(JSON.stringify({ data: "tes produits" }), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
