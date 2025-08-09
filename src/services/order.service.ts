// services/orderService.ts
import { OrderStatus,PaymentMethod, PaymentStatus } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { CreateOrderRequest } from '@/types/payment';

export class OrderService {
  static async createOrder(data: CreateOrderRequest) {
  try {
      // Générer un numéro de commande unique
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Créer ou récupérer l'adresse
      const address = await prisma.address.create({
        data: {
          clientId: data.clientId,
          firstName: data.formData.firstName,
          lastName: data.formData.lastName,
          addressLine1: data.formData.address,
          city: data.formData.country,
          country: data.formData.country,
          postalCode: '00000',
          phone: data.formData.phone,
        },
      });

      // SOLUTION 1: Utiliser connect pour lier le produit existant
      const order = await prisma.order.create({
        data: {
          orderNumber,
          clientId: data.clientId,
          status: OrderStatus.PENDING,
          subtotal: data.totals.subtotal,
          shippingCost: data.totals.shippingCost,
          taxAmount: data.totals.taxAmount,
          totalAmount: data.totals.totalAmount,
          shippingAddressId: address.id,
          billingAddressId: address.id,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod.toUpperCase() as PaymentMethod,
          items: {
            create: data.items.map(item => ({
              product: {
                connect: { id: item.productId },
              },
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
              productName: item.name,
              productSku: `SKU-${item.id}`,
              variantInfo: item.variantInfo || undefined, // Utiliser undefined au lieu de null
            })),
          },
        },
        include: {
          items: true,
          client: true,
          shippingAddress: true,
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Erreur création commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  static async updateOrderPaymentStatus(
    orderId: string, 
    paymentStatus: PaymentStatus, 
    paymentIntentId?: string
  ) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus,
          status: paymentStatus === PaymentStatus.COMPLETED ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
          notes: paymentIntentId ? `PaymentIntent ID: ${paymentIntentId}` : undefined,
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Erreur mise à jour commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  static async getOrderById(orderId: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          client: {
            include: {
              user: {
                select: { email: true },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Erreur récupération commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  static async clearCart(clientId: string) {
    try {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            clientId,
          },
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur vidage panier:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}