import React from 'react';

export default function AuthLoadingPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#F5F7FA'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>TURF</div>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #eee',
        borderTopColor: '#0066FF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '1rem' }}>Completing your sign-in...</p>
    </div>
  );
} 