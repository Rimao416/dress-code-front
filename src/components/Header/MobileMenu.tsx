import React from 'react';
import Link from 'next/link';
import { X, ChevronDown } from 'lucide-react';
import { NavigationData } from '@/types/header';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationData: NavigationData;
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationData,
  expandedSection,
  onToggleSection,
}) => {
  const mobileMenuItems = Object.entries(navigationData).map(([key, nav]) => ({
    key,
    label: key,
    hasDropdown: nav.hasDropdown,
    link: nav.link,
  }));

  return (
    <div className="md:hidden">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-serif text-neutral-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
          <div className="space-y-0">
            {mobileMenuItems.map((item) => (
              <div key={item.key} className="border-b border-stone-100">
                {item.hasDropdown ? (
                  <div>
                    <div className="flex items-center">
                      <Link
                        href={item.link}
                        className="flex-1 py-3 text-left text-neutral-700 hover:text-red-900 font-medium transition-colors"
                      >
                        {item.label}
                      </Link>
                      <button onClick={() => onToggleSection(item.key)} className="p-3">
                        <ChevronDown
                          className={`h-4 w-4 transform transition-transform ${
                            expandedSection === item.key ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {expandedSection === item.key && navigationData[item.key]?.content && (
                      <div className="pb-4">
                        {navigationData[item.key].content?.left?.map((linkItem, index) => (
                          <Link
                            key={index}
                            href={linkItem.link}
                            className="block py-2 pl-4 text-sm text-neutral-600 hover:text-red-900 transition-colors"
                          >
                            {linkItem.title}
                          </Link>
                        ))}
                        {navigationData[item.key].content?.right?.map(
                          (section, sectionIndex) => (
                            <div key={sectionIndex} className="mt-4">
                              <h4 className="text-sm font-semibold text-neutral-900 pl-4 mb-2 uppercase tracking-wide">
                                {section.title}
                              </h4>
                              {section.items?.map((linkItem, linkIndex) => (
                                <Link
                                  key={linkIndex}
                                  href={linkItem.link}
                                  className="block py-2 pl-6 text-sm text-neutral-600 hover:text-red-900 transition-colors"
                                >
                                  {linkItem.title}
                                </Link>
                              ))}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.link}
                    className="block py-3 text-neutral-700 hover:text-red-900 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
