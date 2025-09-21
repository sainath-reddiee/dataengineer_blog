import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AdsenseAd = ({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = '',
  adTest = 'off' // Set to 'on' for test ads, 'off' for production ads
}) => {
  const adRef = useRef(null);
  const location = useLocation();
  const adId = useRef(`ad-${Date.now()}-${Math.random()}`);

  useEffect(() => {
    // Initialize AdSense if not already loaded
    initializeAdSense();
  }, []);

  useEffect(() => {
    // Refresh ads on route change
    const timer = setTimeout(() => {
      refreshAd();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const initializeAdSense = () => {
    if (adTest === 'on') {
      // Show placeholder in test mode
      showTestAd();
      return;
    }

    if (!window.adsbygoogle) {
      loadAdSenseScript();
    } else {
      pushAd();
    }
  };

  const loadAdSenseScript = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      window.adsbygoogle = window.adsbygoogle || [];
      pushAd();
    };
    
    script.onerror = () => {
      console.warn('AdSense script failed to load - showing fallback');
      showFallbackAd();
    };
    
    document.head.appendChild(script);
  };

  const refreshAd = () => {
    if (adTest === 'on') {
      showTestAd();
      return;
    }

    if (window.adsbygoogle) {
      // Clear existing ad
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        pushAd();
      }, 50);
    }
  };

  const pushAd = () => {
    if (!window.adsbygoogle || !adRef.current) {
      return;
    }
    
    try {
      // Create new ad element with unique ID
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.id = adId.current;
      adElement.setAttribute('data-ad-client', 'ca-pub-YOUR_PUBLISHER_ID');
      adElement.setAttribute('data-ad-slot', adSlot);
      adElement.setAttribute('data-ad-format', adFormat);
      adElement.setAttribute('data-full-width-responsive', fullWidthResponsive.toString());
      adElement.setAttribute('data-ad-test', adTest === 'on' ? 'on' : 'off');
      
      adRef.current.appendChild(adElement);
      
      // Push the ad with error handling
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (pushError) {
        console.warn('AdSense push error:', pushError);
        showFallbackAd();
      }
    } catch (error) {
      console.error('AdSense error:', error);
      showFallbackAd();
    }
  };

  const showTestAd = () => {
    if (adRef.current) {
      adRef.current.innerHTML = `
        <div style="
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          border: 1px solid rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          min-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
        ">
          <div style="font-size: 9px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Advertisement</div>
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 3px; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DataEngineer Hub</div>
          <div style="
            background: rgba(96, 165, 250, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            opacity: 0.8;
            border: 1px solid rgba(96, 165, 250, 0.1);
            font-weight: 500;
          ">
            Premium Content • Expert Tutorials
          </div>
        </div>
      `;
    }
  };

  const showFallbackAd = () => {
    if (adRef.current) {
      adRef.current.innerHTML = `
        <div style="
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          color: #9ca3af;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          min-height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
          <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">Advertisement</div>
          <div style="font-size: 14px; opacity: 0.4;">Content Loading...</div>
        </div>
      `;
    }
  };

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className} relative`}
      style={{
        textAlign: 'center',
        margin: '0',
        minHeight: '90px',
        zIndex: 5,
        ...style
      }}
    />
  );
};

export default AdsenseAd;