import React, { useEffect } from 'react';

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

const netlifyDeployUrl = "https://app.netlify.com/start/deploy?repository=https://github.com/hannesmitterer/musk_vs_trump";

export default function DeployButton() {
  // Auto-deploy behavior for desktop users
  useEffect(() => {
    if (!isMobile()) {
      // For desktop users, we could add auto-deploy logic here if needed
      // For now, we just ensure the button is always visible
      console.log('Deploy button available for desktop users');
    }
  }, []);

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
      <h3>🚀 {isMobile() ? 'One-Tap Mobile Deploy' : 'Quick Deploy'}</h3>
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
        {isMobile() ? 'Setup & Run Mobile Site' : 'Deploy Your Site'}
      </a>
      <div style={{marginTop: '1em', fontSize: '0.95em'}}>
        <span>
          {isMobile() 
            ? 'Instantly deploy your own live static mobile site—no login or setup needed!'
            : 'Instantly deploy your own live static site—no login or setup needed! Works seamlessly on both desktop and mobile.'}
        </span>
      </div>
    </div>
  );
}