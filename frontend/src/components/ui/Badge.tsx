import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'sage' | 'primary' | 'muted' | 'terracotta' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  // Explicit Prohibition: DO NOT use harsh marketplace generic red discount badges.
  // Use muted luxury earthy palettes that enhance trust and elegance.
  const variantStyles = {
    gold: 'bg-[#F9F4E5] text-[#9A7D18] border border-[#E8DCB5]',
    sage: 'bg-[#EFF2ED] text-[#4E6140] border border-[#CFDACh] border-[#CFDAAF]',
    primary: 'bg-[#F5EFEA] text-[#593E2B] border border-[#DCD1C5]',
    muted: 'bg-[#EEECE7] text-[#635D53] border border-[#D5D0C6]',
    terracotta: 'bg-[#F9EEEB] text-[#914739] border border-[#E3CDCA]',
    success: 'bg-[#EAF3EC] text-[#2F643F] border border-[#C5E1CC]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium tracking-wide rounded-full uppercase',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide rounded-full',
  };

  return (
    <span className={`inline-flex items-center justify-center leading-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
