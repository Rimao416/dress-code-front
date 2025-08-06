export interface Brand {
  id: string;
  name: string;
  description?: string | null; // Compatible avec Prisma
  logo?: string | null;
  website?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
