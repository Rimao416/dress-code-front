// stores/useOrderStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  variant?: {
    id: string;
    size?: string;
    color?: string;
  } | null;
  variantInfo?: any;
}

export interface OrderTracking {
  id: string;
  status: string;
  description?: string;
  location?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  tracking: OrderTracking[];
  shippingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

interface OrderState {
  // State
  orders: Order[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchOrders: () => Promise<void>;
  clearOrders: () => void;
  reset: () => void;
}

const initialState = {
  orders: [],
  loading: false,
  error: null,
  initialized: false,
};

export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setOrders: (orders) => set({ orders, initialized: true }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),

      fetchOrders: async () => {
        const { loading } = get();
        
        // Éviter les appels multiples simultanés
        if (loading) return;

        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/orders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Non authentifié');
            }
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.success) {
            set({ 
              orders: data.orders, 
              loading: false, 
              error: null,
              initialized: true 
            });
          } else {
            throw new Error(data.error || 'Erreur lors du chargement des commandes');
          }
        } catch (err) {
          console.error('❌ Erreur fetchOrders:', err);
          set({ 
            error: err instanceof Error ? err.message : 'Erreur inconnue',
            loading: false,
            orders: [] 
          });
        }
      },

      clearOrders: () => set({ orders: [], initialized: false }),

      reset: () => set(initialState),
    }),
    { name: 'OrderStore' }
  )
);