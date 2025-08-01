import React, { forwardRef } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'black'
  | 'black-outline';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'font-medium rounded-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.97] flex items-center justify-center gap-2';

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-red-800 to-red-700 text-white hover:from-red-900 hover:to-red-800 shadow-md',
      secondary:
        'border border-stone-200 bg-white text-gray-700 hover:bg-stone-100 hover:border-stone-300',
      outline:
        'border border-red-800 text-red-800 hover:bg-red-800 hover:text-white',
      ghost:
        'text-red-800 hover:bg-red-50',
      danger:
        'bg-red-600 text-white hover:bg-red-700',
      black:
        'bg-neutral-900 text-white hover:bg-neutral-800',
      'black-outline':
        'border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        {leftIcon && !loading && leftIcon}
        {children}
        {rightIcon && !loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
