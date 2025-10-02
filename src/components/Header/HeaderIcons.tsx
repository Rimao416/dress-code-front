import React from 'react';
import { Search, Heart, ShoppingBag, Menu, User } from 'lucide-react';

interface HeaderIconsProps {
  favoritesCount: number;
  cartItemsCount: number;
  shouldApplyScrolledStyle: boolean;
  onUserClick: () => void;
  onCartClick: () => void;
  onMobileMenuClick: () => void;
  userName?: string;
}

export const HeaderIcons: React.FC<HeaderIconsProps> = ({
  favoritesCount,
  cartItemsCount,
  shouldApplyScrolledStyle,
  onUserClick,
  onCartClick,
  onMobileMenuClick,
  userName,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 rounded-full transition-all duration-200 ${
          shouldApplyScrolledStyle
            ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <Search className="h-4 w-4" />
      </button>
      <button
        className={`p-2 rounded-full relative transition-all duration-200 ${
          shouldApplyScrolledStyle
            ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <Heart className="h-4 w-4" />
        {favoritesCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 ${
              shouldApplyScrolledStyle
                ? 'bg-red-900 text-white'
                : 'bg-white text-neutral-900'
            }`}
          >
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </span>
        )}
      </button>
      <button
        onClick={onCartClick}
        className={`p-2 rounded-full relative transition-all duration-200 ${
          shouldApplyScrolledStyle
            ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <ShoppingBag className="h-4 w-4" />
        {cartItemsCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center transition-all duration-300 ${
              shouldApplyScrolledStyle
                ? 'bg-red-900 text-white'
                : 'bg-white text-neutral-900'
            }`}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </button>
      <button
        onClick={onUserClick}
        className={`flex items-center space-x-1.5 text-xs hover:underline transition-colors duration-300 ${
          shouldApplyScrolledStyle
            ? 'text-neutral-700 hover:text-red-900'
            : 'text-white/90 hover:text-white'
        }`}
      >
        <User className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">
          {userName ? `Bonjour ${userName}` : 'Rejoignez-nous'}
        </span>
      </button>
      <button
        onClick={onMobileMenuClick}
        className={`md:hidden p-2 rounded-full transition-all duration-200 ${
          shouldApplyScrolledStyle
            ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <Menu className="h-4 w-4" />
      </button>
    </div>
  );
};
