import React from 'react';
import { ArrowRight, Code, Zap, Shield } from 'lucide-react';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      {/* Hero Section */}
      <div style={{ padding: '6rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Elevate Your Vision
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginBottom: '2rem', lineHeight: '1.75' }}>
            Where minimalism meets sophistication. Create something extraordinary with our cutting-edge platform.
          </p>
          <button style={{
            backgroundColor: '#fbbf24',
            color: 'black',
            padding: '0.75rem 2rem',
            borderRadius: '0',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }} 
          
          >
            Begin Journey
            <ArrowRight style={{ marginLeft: '0.5rem', transition: 'transform 0.3s' }} size={20} />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        borderTop: '1px solid #1f2937',
        borderBottom: '1px solid #1f2937',
        padding: '6rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '3rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }} >
              <div style={{
                border: '1px solid rgba(250, 179, 36, 0.2)',
                padding: '1rem',
                borderRadius: '0',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                <Zap style={{ color: '#fbbf24' }} size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Swift & Seamless</h3>
              <p style={{ color: '#d1d5db' }}>Performance that exceeds expectations.</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }}>
              <div style={{
                border: '1px solid rgba(250, 179, 36, 0.2)',
                padding: '1rem',
                borderRadius: '0',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                <Code style={{ color: '#fbbf24' }} size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Pure Elegance</h3>
              <p style={{ color: '#d1d5db' }}>Code that reflects your standards.</p>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }} >
              <div style={{
                border: '1px solid rgba(250, 179, 36, 0.2)',
                padding: '1rem',
                borderRadius: '0',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                <Shield style={{ color: '#fbbf24' }} size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Fortified Core</h3>
              <p style={{ color: '#d1d5db' }}>Security without compromise.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem 0',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        © 2025 Your Company. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
