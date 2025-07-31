// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { completeRegistrationSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getSession, updateSessionWithUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
   
    // Validation des données avec Zod
    const validationResult = completeRegistrationSchema.safeParse(body);
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

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      country,
      address,
      postalCode,
      city,
      addressComplement,
    } = validationResult.data;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cette adresse email existe déjà. Essayez de vous connecter." },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur avec les données client en une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "CLIENT",
        },
      });

      // Créer le profil client
    const client = await tx.client.create({
  data: {
    id: user.id,
    firstName,
    lastName,
    phone,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    gender,
    acceptedTerms: true,
    acceptedMarketing: false,
    // Si tu veux créer l'adresse en même temps
  
  },
});

      return { user, client };
    });

    // Récupérer les données complètes pour la réponse
    const userWithClient = await prisma.user.findUnique({
      where: { id: result.user.id },
      select: {
        id: true,
        email: true,
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

    // **NOUVELLE PARTIE : Créer automatiquement la session**
    const session = await getSession();
    const sessionUpdated = await updateSessionWithUser(session, result.user.id);

    if (!sessionUpdated) {
      console.error("Erreur lors de la création de la session après inscription");
      // On continue quand même car l'utilisateur est créé
    }

    // TODO: Envoyer un email de vérification
    // await sendVerificationEmail(user.email, user.id);

    return NextResponse.json(
      {
        message: "Votre compte a été créé avec succès ! Bienvenue parmi nous.",
        user: userWithClient,
        sessionCreated: sessionUpdated, // Indique si la session a été créée
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur lors de la création du compte:", error);
   
    // Gestion spécifique des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà utilisée. Essayez de vous connecter." },
          { status: 409 }
        );
      }
     
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Erreur de données. Veuillez vérifier vos informations." },
          { status: 400 }
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
      if (path === 'firstName') return 'Le prénom est requis';
      if (path === 'lastName') return 'Le nom est requis';
      return `Le champ ${path} est requis`;
     
    case 'invalid_format':
      // Pour les erreurs de format comme email, regex, etc.
      if (path === 'email') {
        return 'Format d\'email invalide';
      }
      if (path === 'phone') {
        return 'Format de téléphone invalide';
      }
      return `Format invalide pour ${path}`;
     
    case 'custom':
      // Pour les validations personnalisées
      return issue.message;
     
    case 'too_small':
      if (path === 'password') return 'Le mot de passe doit contenir au moins 8 caractères';
      if (path === 'firstName') return 'Le prénom doit contenir au moins 2 caractères';
      if (path === 'lastName') return 'Le nom doit contenir au moins 2 caractères';
      return `${path} est trop court`;
     
    case 'too_big':
      return `${path} est trop long`;
     
    default:
      return issue.message;
  }
}