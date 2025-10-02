// hooks/useOrders.ts
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrderStore } from '@/store/useOrderStore';

/**
 * Hook pour charger et accéder aux commandes de l'utilisateur
 * Utilise le store Zustand pour la gestion d'état globale
 */
export const useOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, error, initialized, fetchOrders } = useOrderStore();

  useEffect(() => {
    // Ne charger que si l'utilisateur est connecté et pas déjà chargé
    if (!authLoading && user && !initialized && !loading) {
      fetchOrders();
    }
  }, [user, authLoading, initialized, loading, fetchOrders]);

  return {
    orders,
    loading: authLoading || loading,
    error,
    refetch: fetchOrders,
  };
};