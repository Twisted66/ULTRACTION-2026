/**
 * Template 4: Modern Brutalist Email Signature
 * Bold, chunky design with asymmetric layout and high contrast
 */

import React from 'react';

interface ModernBrutalistSignatureProps {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  logoUrl?: string;
}

const ModernBrutalistSignature: React.FC<ModernBrutalistSignatureProps> = ({
  name = 'JOHN ANDERSON',
  title = 'PROJECT DIRECTOR',
  email = 'john@ultraction.ae',
  phone = '+971 50 123 4567',
  website = 'ultraction.ae',
  address = 'Dubai, United Arab Emirates',
  logoUrl = './logo.png'
}) => {
  const signatureStyle: React.CSSProperties = {
    display: 'table',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#ffffff',
    backgroundColor: '#141414',
    width: '500px',
    maxWidth: '100%',
    boxSizing: 'border-box',
    padding: '0',
    margin: '0'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative'
  };

  const headerBlockStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: '#2c1810',
    padding: '16px 20px',
    alignItems: 'center',
    gap: '16px'
  };

  const logoStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    backgroundColor: '#e8dcc8',
    padding: '6px'
  };

  const brandNameStyle: React.CSSProperties = {
    fontFamily: 'Public Sans, Arial Black, sans-serif',
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '2px',
    color: '#ffffff',
    textTransform: 'uppercase',
    margin: '0',
    lineHeight: '1'
  };

  const mainContentStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0'
  };

  const nameBlockStyle: React.CSSProperties = {
    backgroundColor: '#141414',
    padding: '24px 20px',
    width: '60%'
    // No right border - let elements overlap visually
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: 'Public Sans, Arial Black, sans-serif',
    fontSize: '28px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '0 0 4px 0',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: '600',
    color: '#e8dcc8',
    margin: '0',
    letterSpacing: '3px',
    textTransform: 'uppercase'
  };

  const accentBlockStyle: React.CSSProperties = {
    backgroundColor: '#e8dcc8',
    width: '40%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '20px'
  };

  const roleLabelStyle: React.CSSProperties = {
    fontFamily: 'Public Sans, sans-serif',
    fontSize: '10px',
    fontWeight: '700',
    color: '#2c1810',
    margin: '0',
    transform: 'rotate(-90deg)',
    transformOrigin: 'center',
    letterSpacing: '2px',
    whiteSpace: 'nowrap'
  };

  const contactSectionStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderTop: '4px solid #2c1810'
  };

  const contactGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px 24px'
  };

  const contactItemStyle: React.CSSProperties = {
    margin: '0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const labelStyle: React.CSSProperties = {
    color: '#666666',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    minWidth: '50px'
  };

  const valueStyle: React.CSSProperties = {
    color: '#ffffff',
    fontWeight: '500'
  };

  const linkStyle: React.CSSProperties = {
    color: '#e8dcc8',
    textDecoration: 'none',
    fontWeight: '600'
  };

  const dividerStyle: React.CSSProperties = {
    height: '8px',
    backgroundColor: '#2c1810'
  };

  return (
    <div style={signatureStyle}>
      <div style={containerStyle}>
        {/* Header with Logo */}
        <div style={headerBlockStyle}>
          <img
            src={logoUrl}
            alt="ULTRACTION"
            style={logoStyle}
          />
          <h1 style={brandNameStyle}>ULTRACTION</h1>
        </div>

        {/* Main Content - Split Layout */}
        <div style={mainContentStyle}>
          <div style={nameBlockStyle}>
            <h2 style={nameStyle}>{name}</h2>
            <p style={titleStyle}>{title}</p>
          </div>
          <div style={accentBlockStyle}>
            <span style={roleLabelStyle}>GENERAL CONTRACTING LLC</span>
          </div>
        </div>

        {/* Bold Divider */}
        <div style={dividerStyle}></div>

        {/* Contact Information */}
        <div style={contactSectionStyle}>
          <div style={contactGridStyle}>
            <div style={contactItemStyle}>
              <span style={labelStyle}>EMAIL</span>
              <a href={`mailto:${email}`} style={{...linkStyle, ...valueStyle}}>
                {email}
              </a>
            </div>
            <div style={contactItemStyle}>
              <span style={labelStyle}>PHONE</span>
              <span style={valueStyle}>{phone}</span>
            </div>
            <div style={contactItemStyle}>
              <span style={labelStyle}>WEB</span>
              <a href={`https://${website}`} style={{...linkStyle, ...valueStyle}}>
                {website}
              </a>
            </div>
            <div style={contactItemStyle}>
              <span style={labelStyle}>BASE</span>
              <span style={valueStyle}>{address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBrutalistSignature;
