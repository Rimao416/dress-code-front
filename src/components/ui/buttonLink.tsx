import React from 'react';
import Link, { LinkProps } from 'next/link';

type ButtonLinkVariant = 'default' | 'outlined' | 'hovered';

interface ButtonLinkProps extends Omit<LinkProps, 'href'> {
  variant?: ButtonLinkVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  href: string; // Ou `href: string | UrlObject;` si tu veux permettre un objet URL.
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  href,
  ...props
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 inline-block';

  const variantClasses: Record<ButtonLinkVariant, string> = {
    default:
      'text-white border-b-2 border-white pb-1 hover:border-gray-300 hover:text-gray-300',
    outlined:
      'text-white border-b-2 border-white pb-1 hover:border-white hover:text-white',
    hovered:
      'text-gray-700 border-b-2 border-gray-700 pb-1 hover:border-gray-500 hover:text-gray-500',
  };

  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
