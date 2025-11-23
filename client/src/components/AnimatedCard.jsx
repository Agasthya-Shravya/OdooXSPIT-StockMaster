import React from 'react';

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  gradient = false,
  borderColor = 'primary'
}) {
  const borderColors = {
    primary: 'border-l-primary-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    danger: 'border-l-red-500',
    info: 'border-l-blue-500',
    purple: 'border-l-purple-500'
  };

  const borderClass = borderColors[borderColor] || borderColors.primary;
  
  return (
    <div
      className={`
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}
        ${borderClass}
        rounded-lg shadow-lg p-6
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
