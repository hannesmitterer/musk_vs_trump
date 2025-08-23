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
      <div style={{marginBottom: '0.5em', fontSize: '1em'}}>
        Deploy your own instance instantly to Netlify!
      </div>
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
        🚀 Deploy to Netlify
      </a>
    </div>
  );
}