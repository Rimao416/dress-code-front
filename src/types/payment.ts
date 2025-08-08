// types/payment.ts
export interface StripePaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentFormData {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
}

export interface ShippingData {
  method: string;
  cost: number;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantInfo?: {
    size?: string;
    color?: string;
  };
}

export interface CreateOrderRequest {
  clientId: string;
  formData: PaymentFormData;
  shippingMethod: string;
  paymentMethod: string;
  items: OrderItem[];
  totals: {
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  clientSecret?: string;
  error?: string;
}