// services/orderService.ts
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { CreateOrderRequest } from '@/types/payment';

export class OrderService {
  /**
   * Créer une nouvelle commande
   */
  static async createOrder(data: CreateOrderRequest) {
    try {
      // Générer un numéro de commande unique
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      console.log('📦 Création commande:', orderNumber);

      // Créer l'adresse de livraison
      const shippingAddress = await prisma.address.create({
        data: {
          clientId: data.clientId,
          firstName: data.formData.firstName,
          lastName: data.formData.lastName,
          addressLine1: data.formData.address,
          city: data.formData.country, // Ou utiliser une vraie ville si disponible
          country: data.formData.country,
          postalCode: data.formData.postalCode || '00000',
          phone: data.formData.phone,
        },
      });

      // Utiliser la même adresse pour la facturation (ou créer une différente si nécessaire)
      const billingAddress = shippingAddress;

      // Créer la commande avec ses articles
      const order = await prisma.order.create({
        data: {
          orderNumber,
          clientId: data.clientId,
          status: OrderStatus.PENDING,
          subtotal: data.totals.subtotal,
          shippingCost: data.totals.shippingCost,
          taxAmount: data.totals.taxAmount,
          discountAmount: data.totals.discountAmount || 0,
          totalAmount: data.totals.totalAmount,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress.id,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: data.paymentMethod,
          items: {
            create: data.items.map(item => {
              // Construction de l'objet OrderItem
              const orderItem: any = {
                product: {
                  connect: { id: item.productId },
                },
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity,
                productName: item.name,
                productSku: `SKU-${item.id}`,
                variantInfo: item.variantInfo || undefined,
              };

              // ✅ Ajouter le variant seulement s'il existe et n'est pas vide
              if (item.variantId && item.variantId.trim() !== '') {
                orderItem.variant = {
                  connect: { id: item.variantId },
                };
              }

              return orderItem;
            }),
          },
        },
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

      console.log('✅ Commande créée:', order.id);

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Mettre à jour la commande avec le PaymentIntent ID
   */
  static async updateOrderWithPaymentIntent(
    orderId: string,
    paymentIntentId: string
  ) {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          notes: `PaymentIntent ID: ${paymentIntentId}`,
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Erreur mise à jour PaymentIntent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Mettre à jour le statut de paiement de la commande
   */
  static async updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentIntentId?: string
  ) {
    try {
      const updateData: any = {
        paymentStatus,
        status: paymentStatus === PaymentStatus.COMPLETED 
          ? OrderStatus.CONFIRMED 
          : OrderStatus.PENDING,
      };

      if (paymentIntentId) {
        updateData.notes = `PaymentIntent ID: ${paymentIntentId}`;
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
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
        },
      });

      console.log('✅ Statut commande mis à jour:', order.status, order.paymentStatus);

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('❌ Erreur mise à jour commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Créer un tracking pour la commande
   */
  static async createOrderTracking(
    orderId: string,
    status: string,
    description?: string,
    location?: string
  ) {
    try {
      const tracking = await prisma.orderTracking.create({
        data: {
          orderId,
          status,
          description,
          location,
        },
      });

      console.log('✅ Tracking créé:', tracking.id);

      return {
        success: true,
        tracking,
      };
    } catch (error) {
      console.error('❌ Erreur création tracking:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Récupérer une commande par son ID
   */
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
          tracking: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('❌ Erreur récupération commande:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Récupérer les commandes d'un client
   */
  static async getClientOrders(clientId: string) {
    try {
      const orders = await prisma.order.findMany({
        where: { clientId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingAddress: true,
          tracking: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        orders,
      };
    } catch (error) {
      console.error('❌ Erreur récupération commandes client:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Vider le panier d'un client
   */
  static async clearCart(clientId: string) {
    try {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            clientId,
          },
        },
      });

      console.log('✅ Panier vidé pour client:', clientId);

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur vidage panier:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}