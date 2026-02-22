/**
 * Template2-ExecutiveLuxury.tsx
 *
 * Premium, high-end corporate email signature for ULTRACTION GENERAL CONTRACTING LLC
 * Aesthetic: Executive Luxury - refined, elegant, with generous whitespace
 *
 * Features:
 * - Maroon (#2c1810) dominant with black accents
 * - Generous whitespace and elegant spacing
 * - Refined typography hierarchy
 * - Subtle decorative elements
 * - Social media icons
 */

import React from 'react';

// Social media SVG icons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface ExecutiveLuxurySignatureProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  logoUrl?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const Template2ExecutiveLuxury: React.FC<ExecutiveLuxurySignatureProps> = ({
  name = 'Ahmed Al Mazrouei',
  title = 'Chief Executive Officer',
  email = 'ahmed.mazrouei@ultraction.ae',
  phone = '+971 50 123 4567',
  website = 'ultraction.ae',
  address = 'Office M05, C32, Shabiya 9, MBZ City, Abu Dhabi, UAE',
  logoUrl = '/email-signatures/claudecode/logo.png',
  socialLinks = {
    facebook: 'https://facebook.com/ultraction',
    instagram: 'https://instagram.com/ultraction',
    linkedin: 'https://linkedin.com/company/ultraction'
  }
}) => {
  // Brand colors
  const colors = {
    maroon: '#2c1810',
    black: '#141414',
    beige: '#e8dcc8',
    lightBeige: '#f2ece1',
    gold: '#c4a77d',
    white: '#ffffff'
  };

  return (
    <div
      style={{
        fontFamily: "'Public Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: colors.white,
        maxWidth: '600px',
        margin: '0',
        padding: '0',
        boxSizing: 'border-box'
      }}
    >
      {/* Main container with elegant border */}
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          width: '100%',
          backgroundColor: colors.white,
          border: '1px solid #e8dcc8',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: '0' }}>
              {/* Top accent bar */}
              <div
                style={{
                  height: '6px',
                  background: `linear-gradient(90deg, ${colors.maroon} 0%, ${colors.black} 100%)`,
                  width: '100%'
                }}
              />

              {/* Main content */}
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ width: '100%' }}
              >
                <tbody>
                  <tr>
                    {/* Left section - Logo and decorative accent */}
                    <td
                      valign="top"
                      style={{
                        width: '180px',
                        backgroundColor: colors.lightBeige,
                        padding: '32px 24px',
                        borderRight: '1px solid #e8dcc8',
                        position: 'relative'
                      }}
                    >
                      {/* Decorative corner accent */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          width: '24px',
                          height: '24px',
                          borderTop: `3px solid ${colors.maroon}`,
                          borderLeft: `3px solid ${colors.maroon}`
                        }}
                      />

                      {/* Logo */}
                      <img
                        src={logoUrl}
                        alt="ULTRACTION"
                        width={140}
                        style={{
                          display: 'block',
                          marginBottom: '24px'
                        }}
                      />

                      {/* Decorative line */}
                      <div
                        style={{
                          width: '40px',
                          height: '2px',
                          backgroundColor: colors.maroon,
                          marginBottom: '24px'
                        }}
                      />

                      {/* Company tagline */}
                      <div
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: colors.maroon,
                          fontWeight: '600',
                          lineHeight: '1.6'
                        }}
                      >
                        Building<br />
                        Excellence<br />
                        Since 2010
                      </div>

                      {/* Bottom decorative element */}
                      <div
                        style={{
                          marginTop: '32px',
                          width: '100%',
                          height: '1px',
                          background: `linear-gradient(90deg, ${colors.maroon} 0%, transparent 100%)`
                        }}
                      />
                    </td>

                    {/* Right section - Contact information */}
                    <td
                      valign="top"
                      style={{
                        padding: '32px 40px 32px 36px',
                        backgroundColor: colors.white
                      }}
                    >
                      {/* Name */}
                      <div
                        style={{
                          fontFamily: "'Public Sans', serif",
                          fontSize: '26px',
                          fontWeight: '700',
                          color: colors.black,
                          lineHeight: '1.2',
                          marginBottom: '4px',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {name}
                      </div>

                      {/* Title with accent */}
                      <table cellPadding="0" cellSpacing="0" border={0} style={{ marginBottom: '28px' }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: colors.maroon,
                                paddingRight: '12px'
                              }}
                            >
                              {title}
                            </td>
                            <td>
                              <div
                                style={{
                                  width: '32px',
                                  height: '1px',
                                  backgroundColor: colors.maroon,
                                  opacity: '0.3'
                                }}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Contact information grid */}
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{ marginBottom: '24px', width: '100%' }}
                      >
                        <tbody>
                          {/* Email */}
                          <tr>
                            <td
                              style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#7c746c',
                                width: '50px',
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              Email
                            </td>
                            <td
                              style={{
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              <a
                                href={`mailto:${email}`}
                                style={{
                                  fontSize: '14px',
                                  color: colors.black,
                                  textDecoration: 'none',
                                  fontWeight: '500',
                                  fontFamily: "'Inter', sans-serif"
                                }}
                              >
                                {email}
                              </a>
                            </td>
                          </tr>

                          {/* Phone */}
                          <tr>
                            <td
                              style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#7c746c',
                                width: '50px',
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              Phone
                            </td>
                            <td
                              style={{
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              <a
                                href={`tel:${phone.replace(/\s/g, '')}`}
                                style={{
                                  fontSize: '14px',
                                  color: colors.black,
                                  textDecoration: 'none',
                                  fontWeight: '500',
                                  fontFamily: "'Inter', sans-serif"
                                }}
                              >
                                {phone}
                              </a>
                            </td>
                          </tr>

                          {/* Website */}
                          <tr>
                            <td
                              style={{
                                fontSize: '10px',
                                fontWeight: '600',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: '#7c746c',
                                width: '50px',
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              Web
                            </td>
                            <td
                              style={{
                                paddingBottom: '12px',
                                verticalAlign: 'middle'
                              }}
                            >
                              <a
                                href={`https://${website}`}
                                style={{
                                  fontSize: '14px',
                                  color: colors.maroon,
                                  textDecoration: 'none',
                                  fontWeight: '600',
                                  fontFamily: "'Inter', sans-serif",
                                  letterSpacing: '0.02em'
                                }}
                              >
                                {website}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Address section */}
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#5a5550',
                          lineHeight: '1.6',
                          marginBottom: '20px',
                          fontFamily: "'Inter', sans-serif",
                          paddingLeft: '50px'
                        }}
                      >
                        {address}
                      </div>

                      {/* Social media icons */}
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{ marginLeft: '50px' }}
                      >
                        <tbody>
                          <tr>
                            {socialLinks?.facebook && (
                              <td style={{ paddingRight: '16px' }}>
                                <a
                                  href={socialLinks.facebook}
                                  style={{
                                    display: 'block',
                                    color: colors.maroon,
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <FacebookIcon />
                                </a>
                              </td>
                            )}
                            {socialLinks?.instagram && (
                              <td style={{ paddingRight: '16px' }}>
                                <a
                                  href={socialLinks.instagram}
                                  style={{
                                    display: 'block',
                                    color: colors.maroon,
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <InstagramIcon />
                                </a>
                              </td>
                            )}
                            {socialLinks?.linkedin && (
                              <td>
                                <a
                                  href={socialLinks.linkedin}
                                  style={{
                                    display: 'block',
                                    color: colors.maroon,
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s'
                                  }}
                                >
                                  <LinkedInIcon />
                                </a>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Bottom accent bar */}
              <div
                style={{
                  height: '4px',
                  background: `linear-gradient(90deg, ${colors.black} 0%, ${colors.maroon} 50%, ${colors.gold} 100%)`,
                  width: '100%'
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Template2ExecutiveLuxury;
