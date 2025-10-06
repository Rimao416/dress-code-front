// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmailAsync } from "@/lib/email/service";

// Fonction pour générer un token sécurisé
function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation basique
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { 
        id: true, 
        email: true, 
        // firstName: true
      },
    });

    // IMPORTANT: Pour la sécurité, on retourne toujours le même message
    // même si l'email n'existe pas (éviter l'énumération d'emails)
    if (!user) {
      return NextResponse.json(
        {
          message:
            "Si cet email existe dans notre base, vous recevrez un lien de réinitialisation.",
        },
        { status: 200 }
      );
    }

    // Supprimer les anciens tokens pour cet email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    });

    // Créer un nouveau token valide 1 heure
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    });

    // Construire l'URL de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    
    // Envoyer l'email de manière asynchrone (sans bloquer la réponse)
    sendResetPasswordEmailAsync({
      email: user.email,
    //   firstName: user.firstName || undefined,
      resetUrl,
    });

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔐 Reset token pour ${normalizedEmail}`);
      console.log(`Token: ${token}`);
      console.log(`Lien: ${resetUrl}\n`);
    }

    return NextResponse.json(
      {
        message:
          "Si cet email existe dans notre base, vous recevrez un lien de réinitialisation.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur forgot-password:", error);
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