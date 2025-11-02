import React from 'react';
import { H1, Lead } from '../ui/Typography';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  description,
  showCTA = false,
  ctaText = 'Get Started',
  onCtaClick,
  className = '',
}) => {
  return (
    <header className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {subtitle && (
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-4">
              {subtitle}
            </p>
          )}
          <H1 className="text-white mb-6">
            {title}
          </H1>
          {description && (
            <Lead className="text-blue-100 max-w-3xl mx-auto mb-8">
              {description}
            </Lead>
          )}
          {showCTA && (
            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {ctaText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Learn More
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
