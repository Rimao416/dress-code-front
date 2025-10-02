import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavigationData } from '@/types/header';

interface DesktopNavigationProps {
  navigationData: NavigationData;
  activeDropdown: string | null;
  onMouseEnter: (menu: string) => void;
  onMouseLeave: () => void;
  shouldApplyScrolledStyle: boolean;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navigationData,
  activeDropdown,
  onMouseEnter,
  onMouseLeave,
  shouldApplyScrolledStyle,
}) => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {Object.entries(navigationData).map(([key, nav]) => (
        <div
          key={key}
          className="relative"
          onMouseEnter={() => nav.hasDropdown && onMouseEnter(key)}
          onMouseLeave={() => nav.hasDropdown && onMouseLeave()}
        >
          <Link
            href={nav.link}
            className={`flex items-center text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 ${
              shouldApplyScrolledStyle
                ? 'text-neutral-700 hover:text-red-900 hover:bg-stone-50'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            {key}
            {nav.hasDropdown && (
              <ChevronDown
                className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                  activeDropdown === key ? 'rotate-180' : ''
                }`}
              />
            )}
          </Link>
          {/* NE PAS RENDRE LE DROPDOWN ICI */}
        </div>
      ))}
    </nav>
  );
};