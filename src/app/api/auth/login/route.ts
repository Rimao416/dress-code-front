// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { loginSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession, updateSessionWithUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
   
    // Validation des données avec Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      // Messages d'erreur plus explicites pour le frontend
      const errors = validationResult.error.issues.map(issue => ({
        path: issue.path,
        message: getCustomErrorMessage(issue),
      }));
      return NextResponse.json(
        {
          error: "Veuillez corriger les erreurs suivantes",
          details: errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer la session
    const session = await getSession();
    const sessionUpdated = await updateSessionWithUser(session, user.id);

    if (!sessionUpdated) {
      console.error("Erreur lors de la création de la session après connexion");
      return NextResponse.json(
        { error: "Erreur lors de la création de la session. Veuillez réessayer." },
        { status: 500 }
      );
    }

    // Préparer les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Connexion réussie ! Bienvenue de retour.",
        user: userWithoutPassword,
        sessionCreated: sessionUpdated,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
   
    // Gestion spécifique des erreurs
    if (error instanceof Error) {
      if (error.message.includes("Database connection")) {
        return NextResponse.json(
          { error: "Problème de connexion à la base de données. Veuillez réessayer." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite. Veuillez réessayer dans quelques instants." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction helper pour personnaliser les messages d'erreur Zod
function getCustomErrorMessage(issue: z.ZodIssue): string {
  const path = issue.path.join('.');
 
  switch (issue.code) {
    case 'invalid_type':
      if (path === 'email') return 'L\'adresse email est requise';
      if (path === 'password') return 'Le mot de passe est requis';
      return `Le champ ${path} est requis`;
     
    case 'invalid_format':
      if (path === 'email') return 'Format d\'email invalide';
      return `Format invalide pour ${path}`;
     
    case 'custom':
      return issue.message;
     
    case 'too_small':
      if (path === 'password') return 'Le mot de passe doit contenir au moins 1 caractère';
      return `${path} est trop court`;
     
    case 'too_big':
      return `${path} est trop long`;
     
    default:
      return issue.message;
  }
}