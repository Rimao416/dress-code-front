// types/payment.ts
import { PaymentMethod } from '@/generated/prisma';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: string;
  variantId?: string;
  variantInfo?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
}

export interface OrderTotals {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount?: number;
  totalAmount: number;
}

export interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  country: string;
  postalCode?: string;
  city?: string;
}

export interface CreateOrderRequest {
  clientId: string;
  formData: FormData;
  shippingMethod: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totals: OrderTotals;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  paymentIntentId: string;
}

export interface PaymentConfirmRequest {
  paymentIntentId: string;
  orderId: string;
}

export interface PaymentConfirmResponse {
  success: boolean;
  order: any;
  message: string;
}