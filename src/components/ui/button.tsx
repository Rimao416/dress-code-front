import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "black" | "white" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const Button = ({
  children,
  variant = "black",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    black: "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
    white: "bg-white text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
