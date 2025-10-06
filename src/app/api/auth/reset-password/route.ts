// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validation
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Vérifier le token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    if (new Date() > resetToken.expiresAt) {
      // Supprimer le token expiré
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Ce lien a expiré. Veuillez faire une nouvelle demande." },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hash(password, 12);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Supprimer le token utilisé
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    // Supprimer tous les autres tokens pour cet email
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json(
      {
        message:
          "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur reset-password:", error);
    return NextResponse.json(
      {
        error:
          "Une erreur s'est produite. Veuillez réessayer dans quelques instants.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}