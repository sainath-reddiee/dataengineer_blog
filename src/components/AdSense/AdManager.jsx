import React from 'react';
import { useLocation } from 'react-router-dom';
import AdsenseAd from './AdsenseAd';

const AdManager = ({ position, postIndex, category }) => {
  const location = useLocation();
  
  // Show ads based on position and conditions
  const shouldShowAd = () => {
    // Show ads between posts every 3 posts
    if (position === 'between-posts') {
      return postIndex >= 0 && (postIndex + 1) % 3 === 0;
    }
    
    // Always show other ad positions
    return true;
  };

  if (!shouldShowAd()) {
    return null;
  }

  // Different styles for different positions
  const getAdStyle = () => {
    switch (position) {
      case 'header':
        return { maxWidth: '728px', margin: '0 auto', minHeight: '60px' };
      case 'sidebar':
        return { maxWidth: '300px', minHeight: '200px' };
      case 'in-article':
        return { margin: '15px 0', minHeight: '80px' };
      case 'footer':
        return { maxWidth: '728px', margin: '0 auto', minHeight: '60px' };
      case 'between-posts':
        return { margin: '20px 0', minHeight: '90px' };
      default:
        return { margin: '10px 0', minHeight: '80px' };
    }
  };

  // Create unique key for each ad to force re-render on route change
  const adKey = `${position}-${location.pathname}-${postIndex || 0}`;

  return (
    <div className="ad-wrapper" key={adKey}>
      {position === 'between-posts' && (
        <div className="text-center text-gray-500 text-xs mb-3 opacity-60">
          Advertisement
        </div>
      )}
      <AdsenseAd
        key={adKey}
        position={position}
        style={getAdStyle()}
        className={`ad-${position}`}
        showTestAd={true} // Change to false when you have real AdSense setup
      />
    </div>
  );
};

export default AdManager;