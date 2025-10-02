'use client';

import React, { useState } from 'react';
import { 
  User, Package, Calendar, Phone, Mail, 
  LogOut, Edit2, ChevronRight, AlertCircle 
} from 'lucide-react';
import Header from '@/components/common/Header';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/hooks/orders/useOrders';
import Footer from '@/components/common/Footer';

const ProfilePage = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { orders, loading: ordersLoading, error: ordersError, refetch } = useOrders();
  const [activeTab, setActiveTab] = useState('profile');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-stone-100 text-stone-800 border-stone-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Chargement initial
  if (authLoading || !user) {
    return (
      <>
        <Header forceScrolledStyle={true} />
        <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  // À partir d'ici, TypeScript sait que user n'est pas null
  return (
    <>
      <Header forceScrolledStyle={true} />
      <div className="min-h-screen bg-stone-50 pt-32">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    <span className="text-3xl font-bold">
                      {user.client?.firstName?.[0]}{user.client?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif mb-1">
                      {user.client?.firstName} {user.client?.lastName}
                    </h2>
                    <p className="text-white/80 text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-md transition-all border border-white/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-red-900 border-b-2 border-red-900 bg-red-50/30'
                    : 'text-stone-600 hover:text-neutral-900 hover:bg-stone-50'
                }`}
              >
                <User className="w-4 h-4 inline-block mr-2" />
                Informations personnelles
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'text-red-900 border-b-2 border-red-900 bg-red-50/30'
                    : 'text-stone-600 hover:text-neutral-900 hover:bg-stone-50'
                }`}
              >
                <Package className="w-4 h-4 inline-block mr-2" />
                Mes commandes ({orders.length})
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'profile' ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-neutral-900">Informations personnelles</h3>
                <button className="flex items-center gap-2 text-red-900 hover:text-red-800 text-sm font-medium">
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-stone-500 uppercase tracking-wide">Email</label>
                  <div className="flex items-center gap-2 text-neutral-900">
                    <Mail className="w-4 h-4 text-stone-400" />
                    <span>{user.email}</span>
                  </div>
                </div>

                {user.client?.phone && (
                  <div className="space-y-1">
                    <label className="text-xs text-stone-500 uppercase tracking-wide">Téléphone</label>
                    <div className="flex items-center gap-2 text-neutral-900">
                      <Phone className="w-4 h-4 text-stone-400" />
                      <span>{user.client.phone}</span>
                    </div>
                  </div>
                )}

                {user.client?.dateOfBirth && (
                  <div className="space-y-1">
                    <label className="text-xs text-stone-500 uppercase tracking-wide">Date de naissance</label>
                    <div className="flex items-center gap-2 text-neutral-900">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <span>{formatDate(user.client.dateOfBirth)}</span>
                    </div>
                  </div>
                )}

                {user.client?.gender && (
                  <div className="space-y-1">
                    <label className="text-xs text-stone-500 uppercase tracking-wide">Genre</label>
                    <div className="flex items-center gap-2 text-neutral-900">
                      <User className="w-4 h-4 text-stone-400" />
                      <span>{user.client.gender === 'FEMALE' ? 'Femme' : 'Homme'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Erreur */}
              {ordersError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Erreur de chargement</p>
                    <p className="text-sm text-red-700 mt-1">{ordersError}</p>
                    <button
                      onClick={refetch}
                      className="text-sm text-red-800 hover:text-red-900 font-medium mt-2 underline"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              )}

              {/* Loading commandes */}
              {ordersLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-stone-600">Chargement de vos commandes...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-neutral-900 mb-2">Aucune commande</h3>
                  <p className="text-stone-600 mb-6">Vous n'avez pas encore passé de commande</p>
                  <a href="/collections" className="bg-red-900 text-white px-6 py-3 rounded-md hover:bg-red-800 transition-colors inline-block">
                    Découvrir nos produits
                  </a>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-serif text-neutral-900 mb-1">
                            Commande {order.orderNumber}
                          </h4>
                          <p className="text-sm text-stone-600">
                            Passée le {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <p className="text-lg font-bold text-neutral-900 mt-2">
                            {order.totalAmount.toFixed(2)} €
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                              <img
                                src={item.product.images[0] || '/placeholder-image.jpg'}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate">
                                {item.productName}
                              </p>
                              <p className="text-xs text-stone-600">
                                Quantité: {item.quantity} × {item.unitPrice.toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.tracking?.[0] && (
                        <div className="bg-stone-50 rounded-md p-3 mb-4">
                          <p className="text-xs text-stone-600 mb-1">Dernier suivi</p>
                          <p className="text-sm font-medium text-neutral-900">
                            {order.tracking[0].status}
                          </p>
                        </div>
                      )}

                      {/* <button className="w-full flex items-center justify-center gap-2 text-red-900 hover:text-red-800 text-sm font-medium py-2 border-t border-stone-200 transition-colors">
                        Voir les détails
                        <ChevronRight className="w-4 h-4" />
                      </button> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProfilePage;