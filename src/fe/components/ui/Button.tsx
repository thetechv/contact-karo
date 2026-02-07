import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-md transition-all duration-300 inline-flex items-center justify-center";

  const variants = {
    primary:
      "bg-yellow-400 text-black hover:bg-yellow-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
    outline:
      "border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
