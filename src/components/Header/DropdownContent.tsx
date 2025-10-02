import React from 'react';
import Link from 'next/link';
import { DropdownContent as DropdownContentType } from '@/types/header';

interface DropdownContentProps {
  content: DropdownContentType;
}

export const DropdownContent: React.FC<DropdownContentProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-stone-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {content.left && content.left.length > 0 && (
            <div className="col-span-2">
              <div className="space-y-2">
                {content.left.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="block text-sm font-medium text-neutral-900 hover:text-red-900 py-1 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div
            className={`${
              content.left && content.left.length > 0 ? 'col-span-6' : 'col-span-8'
            }`}
          >
            <div className="grid grid-cols-2 gap-8">
              {content.right?.map((section, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wide">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items?.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.link}
                        className="block text-sm text-neutral-700 hover:text-red-900 py-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4">
            {content.featured && (
              <div className="bg-stone-50 p-4 rounded-sm border border-stone-200">
                <img
                  src={content.featured.image}
                  alt={content.featured.title}
                  className="w-full h-32 object-cover rounded-sm mb-3"
                />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {content.featured.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {content.featured.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
