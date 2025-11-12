import { Recycle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-1' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', container: 'gap-2' },
    lg: { icon: 'w-12 h-12', text: 'text-4xl', container: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-5xl', container: 'gap-4' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-sm opacity-50 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-full p-2 shadow-lg">
          <Recycle className={`${currentSize.icon} text-white`} strokeWidth={2.5} />
        </div>
      </div>

      {/* Brand Name */}
      {showText && (
        <div className="flex items-baseline">
          <span 
            className={`${currentSize.text} font-display bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent`}
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            Recycle
          </span>
          <span 
            className={`${currentSize.text} font-display bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent ml-1`}
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            Show
          </span>
        </div>
      )}
    </div>
  );
}

// Simplified logo for small spaces
export function LogoMini() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-sm opacity-50"></div>
      <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-full w-full h-full flex items-center justify-center shadow-lg">
        <Recycle className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
}
