import React from 'react';

const netlifyDeployUrl = "https://app.netlify.com/start/deploy?repository=https://github.com/hannesmitterer/musk_vs_trump";

export default function DeployButton() {
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
      <h3>🚀 One-Click Deploy</h3>
      <a
        href={netlifyDeployUrl}
        target="_blank"
        rel="noopener noreferrer"
        role="button"
        aria-label="Deploy to Netlify - one-click setup"
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
        Deploy to Netlify
      </a>
      <div style={{marginTop: '1em', fontSize: '0.95em'}}>
        <span>
          Instantly deploy your own live static site—no login or setup needed!
        </span>
      </div>
    </div>
  );
}