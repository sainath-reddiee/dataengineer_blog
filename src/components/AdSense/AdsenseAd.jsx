import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AdsenseAd = ({ 
  position = 'auto',
  style = {},
  className = '',
  showTestAd = true // Set to false when you have real AdSense
}) => {
  const adRef = useRef(null);
  const location = useLocation();

  // Ad slot configuration for different positions
  const getAdSlot = (position) => {
    const adSlots = {
      'header': 'YOUR_HEADER_AD_SLOT',
      'sidebar': 'YOUR_SIDEBAR_AD_SLOT', 
      'in-article': 'YOUR_IN_ARTICLE_AD_SLOT',
      'footer': 'YOUR_FOOTER_AD_SLOT',
      'between-posts': 'YOUR_BETWEEN_POSTS_AD_SLOT'
    };
    return adSlots[position] || 'YOUR_DEFAULT_AD_SLOT';
  };

  useEffect(() => {
    if (showTestAd) {
      // Show beautiful test ad
      renderTestAd();
    } else {
      // Try to load real AdSense (only if script is in index.html)
      loadRealAd();
    }
  }, [location.pathname]);

  const renderTestAd = () => {
    if (adRef.current) {
      const adStyles = {
        header: {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          minHeight: '60px',
          content: 'DataEngineer Hub • Premium Content'
        },
        sidebar: {
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          minHeight: '200px',
          content: 'Expert Tutorials • Latest Tech'
        },
        'in-article': {
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          minHeight: '80px',
          content: 'Data Engineering Resources'
        },
        footer: {
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
          minHeight: '60px',
          content: 'Subscribe • Stay Updated'
        },
        'between-posts': {
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
          minHeight: '90px',
          content: 'Trending Articles • Must Read'
        }
      };

      const adStyle = adStyles[position] || adStyles['in-article'];

      adRef.current.innerHTML = `
        <div style="
          ${adStyle.background};
          border: 1px solid rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 12px 16px;
          text-align: center;
          border-radius: 12px;
          font-family: 'Inter', Arial, sans-serif;
          min-height: ${adStyle.minHeight};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        ">
          <div style="font-size: 9px; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Advertisement</div>
          <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DataEngineer Hub</div>
          <div style="
            background: rgba(96, 165, 250, 0.2);
            padding: 4px 12px;
            border-radius: 25px;
            font-size: 11px;
            opacity: 0.9;
            border: 1px solid rgba(96, 165, 250, 0.1);
            font-weight: 500;
          ">
            ${adStyle.content}
          </div>
        </div>
      `;
    }
  };

  const loadRealAd = () => {
    // Only try to load real ads if AdSense script is present
    if (window.adsbygoogle && adRef.current) {
      try {
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', 'ca-pub-YOUR_PUBLISHER_ID'); // Replace with your ID
        adElement.setAttribute('data-ad-slot', getAdSlot(position)); // Use position-specific slot
        adElement.setAttribute('data-ad-format', 'auto');
        adElement.setAttribute('data-full-width-responsive', 'true');
        
        adRef.current.appendChild(adElement);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('AdSense loading failed, showing fallback');
        renderTestAd();
      }
    } else {
      // No AdSense script found, show test ad
      renderTestAd();
    }
  };

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        textAlign: 'center',
        margin: '10px 0',
        zIndex: 5,
        ...style
      }}
    />
  );
};

export default AdsenseAd;