import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`text-5xl font-bold text-gray-900 ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`text-4xl font-bold text-gray-900 ${className}`}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`text-3xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4 className={`text-2xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h4>
);

export const H5: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h5 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h5>
);

export const H6: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h6 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h6>
);

export const Paragraph: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-base text-gray-700 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Lead: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-xl text-gray-600 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <small className={`text-sm text-gray-600 ${className}`}>
    {children}
  </small>
);

export const Muted: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-sm text-gray-500 ${className}`}>
    {children}
  </span>
);
