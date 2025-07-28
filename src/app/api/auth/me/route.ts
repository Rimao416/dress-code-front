// app/api/auth/me/route.ts
import { getSession,isLoggedIn, authenticatedUser } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!isLoggedIn(session)) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await authenticatedUser(session);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.client && {
          firstName: user.client.firstName,
          lastName: user.client.lastName,
          phone: user.client.phone,
          country: user.client.country,
        }),
      },
    });

  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}