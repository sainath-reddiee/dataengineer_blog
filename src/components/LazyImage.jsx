import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://picsum.photos/800/600?random=1',
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
    if (isInView) {
      // Try original source first
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        console.warn('Primary image failed, using fallback:', src);
        // Use fallback immediately
        setImageSrc(fallbackSrc);
        setIsLoaded(true);
        setHasError(true);
      };
      img.src = src;
    }
  }, [isInView, src, fallbackSrc]);

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
          className={`transition-opacity duration-300 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onError={() => {
            if (!hasError && imageSrc !== fallbackSrc) {
              console.warn('Image failed, switching to fallback');
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