import SingleProduct from "@/components/product/SingleProduct";

// app/products/[slug]/page.tsx

// Définir les props avec params comme Promise (Next.js 15)
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Le composant doit être async pour await les params
export default async function ProductPage({ params }: PageProps) {
  // Attendre la résolution de la Promise params
  const { slug } = await params;
  
  return <SingleProduct slug={slug} />;
}

// Générer les métadonnées de manière dynamique
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  // Vous pouvez enrichir les métadonnées en récupérant les infos du produit
  return {
    title: `Produit - ${slug}`,
    description: `Découvrez notre produit ${slug}`,
  };
}
