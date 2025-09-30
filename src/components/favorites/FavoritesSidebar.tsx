// components/favorites/FavoritesSidebar.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { X, Heart, ShoppingBag, Star, Trash2, SortAsc, SortDesc, Search } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/product/useFavorites';
import { useCartStore } from '@/store/useCartStore';
import { FavoriteItem } from '@/types/favorites';

interface FavoritesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteItems?: FavoriteItem[]; // Ajout des données complètes des favoris
}

type SortOption = 'date' | 'name' | 'price';
type SortDirection = 'asc' | 'desc';

const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({ 
  isOpen, 
  onClose,
  favoriteItems = [] // Valeur par défaut
}) => {
  const {
    favoriteIds,
    removeFromFavorites,
    clearFavoritesWithConfirmation,
    isEmpty,
    favoritesCount
  } = useFavorites();

  // Correction: utiliser la méthode correcte du store
  const { addToCart } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fonction pour filtrer les favoris par recherche
  const searchFavorites = (query: string): FavoriteItem[] => {
    const lowercaseQuery = query.toLowerCase();
    return favoriteItems.filter(item =>
      item.product.name.toLowerCase().includes(lowercaseQuery) ||
      item.product.brand?.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Fonction pour trier les favoris par date


  // Fonction pour trier les favoris par nom
  const getFavoritesSortedByName = (ascending: boolean = false): FavoriteItem[] => {
    const items = searchQuery ? searchFavorites(searchQuery) : favoriteItems;
    return [...items].sort((a, b) => {
      const nameA = a.product.name.toLowerCase();
      const nameB = b.product.name.toLowerCase();
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  };

  // Fonction pour trier les favoris par prix
  const getFavoritesSortedByPrice = (ascending: boolean = false): FavoriteItem[] => {
    const items = searchQuery ? searchFavorites(searchQuery) : favoriteItems;
    return [...items].sort((a, b) => {
      return ascending ? a.product.price - b.product.price : b.product.price - a.product.price;
    });
  };

  // Fonction pour obtenir les favoris triés et filtrés
  const getSortedAndFilteredFavorites = (): FavoriteItem[] => {
    switch (sortBy) {

      case 'name':
        return getFavoritesSortedByName(sortDirection === 'asc');
      case 'price':
        return getFavoritesSortedByPrice(sortDirection === 'asc');
      default:
        return searchQuery ? searchFavorites(searchQuery) : favoriteItems;
    }
  };

  // Utiliser useMemo pour optimiser les performances
  const displayedFavorites = useMemo(() => {
    return getSortedAndFilteredFavorites();
  }, [favoriteItems, searchQuery, sortBy, sortDirection]);

  const handleAddToCart = (favoriteItem: FavoriteItem) => {
    const product = favoriteItem.product;
    
    // Utiliser la première variante active ou créer une variante par défaut
    const variant = product.variants.find(v => v.isActive) || {
      id: `main-${product.id}`,
      productId: product.id,
      size: null,
      color: null,
      colorHex: null,
      material: null,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      images: product.images,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addToCart(product, variant, 1);
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    await removeFromFavorites(productId);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Mes Favoris ({favoritesCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search and Sort */}
          {!isEmpty && favoriteItems.length > 0 && (
            <div className="p-4 border-b border-gray-200 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les favoris..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Trier par:</span>
                <button
                  onClick={() => toggleSort('date')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    sortBy === 'date' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Date</span>
                  {sortBy === 'date' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => toggleSort('name')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    sortBy === 'name' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Nom</span>
                  {sortBy === 'name' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => toggleSort('price')}
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    sortBy === 'price' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>Prix</span>
                  {sortBy === 'price' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty || favoriteItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Heart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun favori
                </h3>
                <p className="text-gray-600 mb-6">
                  Commencez à ajouter des produits à vos favoris pour les retrouver facilement.
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Continuer le shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {displayedFavorites.map((favoriteItem) => (
                  <div
                    key={favoriteItem.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    {/* Image */}
                    <Link 
                      href={`/products/${favoriteItem.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={favoriteItem.product.images[0] || '/placeholder.jpg'}
                        alt={favoriteItem.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${favoriteItem.product.slug}`}>
                        <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700 truncate">
                          {favoriteItem.product.name}
                        </h3>
                      </Link>
                      
                      {favoriteItem.product.brand && (
                        <p className="text-xs text-gray-500 mt-1">
                          {favoriteItem.product.brand.name}
                        </p>
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm font-semibold text-gray-900">
                          €{favoriteItem.product.price.toFixed(2)}
                        </span>
                        {favoriteItem.product.comparePrice && favoriteItem.product.comparePrice > favoriteItem.product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            €{favoriteItem.product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {favoriteItem.product._count?.reviews > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="flex items-center">
                            {renderStars(favoriteItem.product.averageRating || 0)}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({favoriteItem.product._count.reviews})
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => handleAddToCart(favoriteItem)}
                          className="flex items-center space-x-1 bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span>Ajouter</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFromFavorites(favoriteItem.productId)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 px-2 py-1 text-xs transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!isEmpty && favoriteItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Link
                href="/favorites"
                onClick={onClose}
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Voir tous les favoris
              </Link>
              <button
                onClick={() => {
                  if (clearFavoritesWithConfirmation()) {
                    // Les favoris ont été vidés
                  }
                }}
                className="w-full text-red-600 text-center py-2 text-sm font-medium hover:text-red-800 transition-colors"
              >
                Vider les favoris
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesSidebar;