// app/api/auth/check-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailSchema } from '@/schemas/auth.schema';

export async function POST(request: NextRequest) {
  try {
    // 1. Parser le body de la requête
    const body = await request.json();
    const { email } = body;

    // 2. Validation avec votre schéma existant
    const validation = emailSchema.safeParse({ email });
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          exists: false,
          message: validation.error.issues[0]?.message || "Email invalide"
        },
        { status: 400 }
      );
    }

    // 3. Vérification en base de données
    // Remplacez cette partie par votre logique de DB existante
    const emailExists = await checkEmailInYourDatabase(email);

    // 4. Retourner la réponse
    return NextResponse.json({
      exists: emailExists,
      message: emailExists 
        ? "Cette adresse email est déjà utilisée" 
        : "Adresse email disponible"
    });

  } catch (error) {
    console.error('Error in check-email route:', error);
    
    return NextResponse.json(
      { 
        exists: false,
        message: "Erreur lors de la vérification de l'email" 
      },
      { status: 500 }
    );
  }
}

// Fonction à adapter selon votre configuration DB
async function checkEmailInYourDatabase(email: string): Promise<boolean> {
  // TODO: Remplacez par votre logique de base de données
  // Exemples selon votre setup :
  
  // Si vous utilisez Prisma :
  // const user = await prisma.user.findUnique({ where: { email } });
  // return !!user;
  
  // Si vous utilisez un autre ORM ou service :
  // const user = await YourUserModel.findOne({ email });
  // return !!user;
  
  // Simulation temporaire pour les tests
  await new Promise(resolve => setTimeout(resolve, 100));
  const testEmails = ['test@example.com', 'admin@test.com'];
  return testEmails.includes(email.toLowerCase());
}