import React from 'react';
import { useLocation } from 'react-router-dom';
import AdsenseAd from './AdsenseAd';

const AdManager = ({ position, postIndex, category }) => {
  const location = useLocation();
  
  // Different ad slots for different positions
  const getAdSlot = (position) => {
    switch (position) {
      case 'header':
        return '1111111111';
      case 'sidebar':
        return '2222222222';
      case 'in-article':
        return '3333333333';
      case 'footer':
        return '4444444444';
      case 'between-posts':
        return '5555555555';
      default:
        return '6666666666';
    }
  };

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

  const adSlot = getAdSlot(position);
  
  // Different styles for different positions
  const getAdStyle = () => {
    switch (position) {
      case 'header':
        return { minHeight: '50px', maxWidth: '728px', margin: '5px auto' };
      case 'sidebar':
        return { minHeight: '250px', maxWidth: '300px' };
      case 'in-article':
        return { minHeight: '100px', margin: '10px 0' };
      case 'footer':
        return { minHeight: '50px', maxWidth: '728px', margin: '5px auto' };
      case 'between-posts':
        return { minHeight: '100px', margin: '15px 0' };
      default:
        return { minHeight: '80px' };
    }
  };

  // Create unique key for each ad to force re-render on route change
  const adKey = `${position}-${adSlot}-${location.pathname}-${postIndex || 0}`;

  return (
    <div className="ad-wrapper relative z-[1]" key={adKey}>
      {position === 'between-posts' && (
        <div className="text-center text-gray-500 text-sm mb-2">
          Advertisement
        </div>
      )}
      <AdsenseAd
        key={adKey}
        adSlot={adSlot}
        style={getAdStyle()}
        className={`ad-${position} relative z-[1]`}
        adFormat={position === 'sidebar' ? 'rectangle' : 'auto'}
        adTest="on"
      />
    </div>
  );
};

export default AdManager;