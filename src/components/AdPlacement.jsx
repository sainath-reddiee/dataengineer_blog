import React, { useEffect } from 'react';

/**
 * Ezoic Ad Placement Component
 * This component creates a placeholder div and calls the Ezoic script to show an ad.
 * @param {object} props - The component props.
 * @param {number} props.placementId - The ad placement ID from your Ezoic dashboard.
 */
const AdPlacement = ({ placementId }) => {
  useEffect(() => {
    // Check if the Ezoic script is available on the window object
    if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
      // The cmd.push ensures that the command is executed after the Ezoic script is fully ready.
      window.ezstandalone.cmd.push(function () {
        // This function tells Ezoic to find the placeholder with the given ID and display an ad.
        window.ezstandalone.showAds([placementId]);
      });
    }
  }, [placementId]); // This effect runs whenever the placementId changes

  // This is the div that Ezoic's script will use to inject the ad.
  return <div id={`ezoic-pub-ad-placeholder-${placementId}`}></div>;
};

export default AdPlacement;