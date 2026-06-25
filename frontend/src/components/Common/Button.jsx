const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-sage-500 to-sage-600 text-white hover:from-sage-600 hover:to-sage-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-sage-700 border border-sage-200 hover:bg-sage-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    crisis: "bg-crisis-500 text-white hover:bg-crisis-600",
    ghost: "text-sage-600 hover:bg-sage-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 rounded-lg",
    lg: "px-6 py-3 rounded-xl text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${sizes[size]} font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;