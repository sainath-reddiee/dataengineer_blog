import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&auto=format',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        console.warn('Image failed to load, trying fallback:', src);
        if (!hasError) {
          setImageSrc(fallbackSrc);
          setIsLoaded(true);
          setHasError(true);
        }
      };
      img.src = src;
    }
  }, [isInView, src, fallbackSrc, hasError]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          onError={() => {
            if (!hasError) {
              setImageSrc(fallbackSrc);
              setHasError(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;