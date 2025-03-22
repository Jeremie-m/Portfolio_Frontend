'use client';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium font-montserrat transition-colors duration-200';
  
  const variants = {
    primary: 'bg-white text-[#C8B20C] border border-white hover:bg-white/90 disabled:bg-transparent disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'text-white border border-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 