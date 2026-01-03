import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClass = 'px-4 py-2 rounded-lg font-semibold transition duration-200';
  const defaultClass = 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const finalClass = className ? `${baseClass} ${disabledClass} ${className}` : `${baseClass} ${defaultClass} ${disabledClass}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
