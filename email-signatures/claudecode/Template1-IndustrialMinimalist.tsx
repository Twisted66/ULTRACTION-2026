/**
 * Template 1: Industrial Minimalist Email Signature
 *
 * Design Philosophy:
 * - Sharp corners, grid-based layout (0px border radius)
 * - Heavy use of black (#141414) borders and dividers
 * - Monospace-style spacing with military precision
 * - Logo on left, structured information grid on right
 * - Very minimal - just essentials with bold structural lines
 */

import React from 'react';

// Brand colors from ULTRACTION brand guidelines
const COLORS = {
  black: '#141414',
  maroon: '#2c1810',
  beige: '#e8dcc8',
  lightBeige: '#f2ece1',
  border: '#b8a486',
};

// Typography settings - inline styles for email compatibility
const FONTS = {
  heading: "'Public Sans', 'Arial Black', Helvetica, Arial, sans-serif",
  body: "'Inter', Helvetica, Arial, sans-serif",
  mono: "'Courier New', 'Consolas', monospace",
};

export interface IndustrialMinimalistSignatureProps {
  /** Person's name */
  name: string;
  /** Job title */
  title: string;
  /** Email address */
  email: string;
  /** Phone number */
  phone: string;
  /** Website URL (defaults to ultraction.ae) */
  website?: string;
  /** Physical address */
  address?: string;
  /** Logo URL (defaults to ULTRACTION logo) */
  logoUrl?: string;
  /** Optional mobile number */
  mobile?: string;
}

/**
 * Industrial Minimalist Email Signature Component
 *
 * @example
 * ```tsx
 * <IndustrialMinimalistSignature
 *   name="Sarah Mitchell"
 *   title="Project Director"
 *   email="sarah.mitchell@ultraction.ae"
 *   phone="+971 4 123 4567"
 *   mobile="+971 50 123 4567"
 *   address="P.O. Box 12345, Dubai, UAE"
 * />
 * ```
 */
export const IndustrialMinimalistSignature: React.FC<IndustrialMinimalistSignatureProps> = ({
  name,
  title,
  email,
  phone,
  mobile,
  website = 'ultraction.ae',
  address,
  logoUrl = 'https://ultraction.ae/logo/UGC-HEADER.png',
}) => {
  const mainContainerStyle: React.CSSProperties = {
    fontFamily: FONTS.body,
    fontSize: '13px',
    lineHeight: '1.5',
    color: COLORS.black,
    backgroundColor: COLORS.lightBeige,
    maxWidth: '600px',
    border: `2px solid ${COLORS.black}`,
    borderRadius: '0px',
    overflow: 'hidden',
  };

  const innerWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  };

  // Left panel - logo with strong border
  const leftPanelStyle: React.CSSProperties = {
    width: '140px',
    minWidth: '140px',
    backgroundColor: COLORS.black,
    borderRight: `2px solid ${COLORS.black}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 16px',
    boxSizing: 'border-box',
  };

  const logoStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    filter: 'brightness(0) invert(1)', // Make logo white on black background
  };

  // Right panel - information grid
  const rightPanelStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.lightBeige,
  };

  // Name section
  const nameContainerStyle: React.CSSProperties = {
    borderBottom: `1px solid ${COLORS.black}`,
    paddingBottom: '8px',
    marginBottom: '12px',
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: FONTS.heading,
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.black,
    margin: '0',
    letterSpacing: '-0.5px',
    textTransform: 'uppercase',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: FONTS.body,
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.maroon,
    margin: '4px 0 0 0',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  // Info grid
  const infoGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '6px 12px',
    fontSize: '12px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONTS.mono,
    fontSize: '10px',
    fontWeight: 600,
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    opacity: 0.7,
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: FONTS.body,
    fontSize: '12px',
    color: COLORS.black,
    margin: '0',
  };

  const linkStyle: React.CSSProperties = {
    color: COLORS.black,
    textDecoration: 'none',
    borderBottom: `1px solid ${COLORS.maroon}`,
    transition: 'all 0.2s ease',
  };

  const companyBarStyle: React.CSSProperties = {
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: `2px solid ${COLORS.black}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const companyNameStyle: React.CSSProperties = {
    fontFamily: FONTS.heading,
    fontSize: '10px',
    fontWeight: 700,
    color: COLORS.black,
    margin: '0',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  };

  const structuralAccentStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    backgroundColor: COLORS.maroon,
    borderRadius: '0',
  };

  const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span style={{ display: 'inline-block', width: '14px', textAlign: 'center', marginRight: '6px' }}>
      {children}
    </span>
  );

  // Simple icons as inline SVG
  const EmailIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  const WebIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  return (
    <div style={mainContainerStyle}>
      <div style={innerWrapperStyle}>
        {/* Left Panel - Logo */}
        <div style={leftPanelStyle}>
          <img
            src={logoUrl}
            alt="ULTRACTION"
            style={logoStyle}
            width="108"
            height="auto"
          />
        </div>

        {/* Right Panel - Information */}
        <div style={rightPanelStyle}>
          {/* Name and Title */}
          <div style={nameContainerStyle}>
            <h1 style={nameStyle}>{name}</h1>
            <p style={titleStyle}>{title}</p>
          </div>

          {/* Information Grid */}
          <div style={infoGridStyle}>
            <div style={labelStyle}>EMAIL</div>
            <div style={valueStyle}>
              <IconWrapper>
                <EmailIcon />
              </IconWrapper>
              <a href={`mailto:${email}`} style={linkStyle}>
                {email}
              </a>
            </div>

            <div style={labelStyle}>PHONE</div>
            <div style={valueStyle}>
              <IconWrapper>
                <PhoneIcon />
              </IconWrapper>
              <a href={`tel:${phone.replace(/\s/g, '')}`} style={linkStyle}>
                {phone}
              </a>
            </div>

            {mobile && (
              <>
                <div style={labelStyle}>MOBILE</div>
                <div style={valueStyle}>
                  <IconWrapper>
                    <PhoneIcon />
                  </IconWrapper>
                  <a href={`tel:${mobile.replace(/\s/g, '')}`} style={linkStyle}>
                    {mobile}
                  </a>
                </div>
              </>
            )}

            <div style={labelStyle}>WEB</div>
            <div style={valueStyle}>
              <IconWrapper>
                <WebIcon />
              </IconWrapper>
              <a href={`https://${website}`} style={linkStyle}>
                {website}
              </a>
            </div>

            {address && (
              <>
                <div style={labelStyle}>ADDRESS</div>
                <div style={valueStyle}>
                  <IconWrapper>
                    <LocationIcon />
                  </IconWrapper>
                  <span>{address}</span>
                </div>
              </>
            )}
          </div>

          {/* Company Bar with Structural Accent */}
          <div style={companyBarStyle}>
            <p style={companyNameStyle}>ULTRACTION GENERAL CONTRACTING LLC</p>
            <div style={structuralAccentStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialMinimalistSignature;
