import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const ImageWithFallback = ({ src, alt, className = '', loading = 'lazy' }: Props) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: 'linear-gradient(135deg, hsl(225, 40%, 8%), hsl(225, 30%, 12%))',
        }}
      >
        <span className="text-xs font-display tracking-wider text-muted-foreground">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ImageWithFallback;
