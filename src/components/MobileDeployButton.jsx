import React from 'react';

function isMobile() {
  // For development, we can also check for a specific viewport width
  const isMobileUserAgent = /Mobi|Android/i.test(navigator.userAgent);
  const isMobileViewport = window.innerWidth <= 768; // Tablets and below
  
  // Debug logging
  console.log('Mobile detection:', {
    userAgent: navigator.userAgent,
    isMobileUserAgent,
    windowWidth: window.innerWidth,
    isMobileViewport,
    finalResult: isMobileUserAgent || isMobileViewport
  });
  
  return isMobileUserAgent || isMobileViewport;
}

const netlifyDeployUrl = "https://app.netlify.com/start/deploy?repository=https://github.com/hannesmitterer/musk_vs_trump";

export default function MobileDeployButton() {
  if (!isMobile()) return null;

  return (
    <div style={{
      width: '100%',
      background: '#222',
      color: '#fff',
      padding: '1em',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h3>🚀 One-Tap Mobile Deploy</h3>
      <a
        href={netlifyDeployUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          fontSize: '1.2em',
          padding: '0.8em 1.5em',
          background: '#00ad9f',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Setup & Run Mobile Site
      </a>
      <div style={{marginTop: '1em', fontSize: '0.95em'}}>
        <span>
          Instantly deploy your own live static mobile site—no login or setup needed!
        </span>
      </div>
    </div>
  );
}