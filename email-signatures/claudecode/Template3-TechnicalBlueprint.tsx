/**
 * Template 3: Technical Blueprint Email Signature
 *
 * Inspired by architectural blueprints and technical drawings.
 * Features grid lines, measurement marks, and blueprint aesthetic.
 */

import React from 'react';

interface TechnicalBlueprintSignatureProps {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  licenseNumber?: string;
  logoUrl?: string;
}

const TechnicalBlueprintSignature: React.FC<TechnicalBlueprintSignatureProps> = ({
  name = 'JOHN ANDERSON',
  title = 'PROJECT MANAGER',
  email = 'john.anderson@ultraction.ae',
  phone = '+971 50 123 4567',
  website = 'www.ultraction.ae',
  address = 'Dubai, United Arab Emirates',
  licenseNumber = 'UAE-CONTRACT-2024-001',
  logoUrl = './logo.png',
}) => {
  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: '#e8dcc8',
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blueprint Grid Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(44, 24, 16, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(44, 24, 16, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Border with Technical Markings */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, #2c1810 0%, #141414 50%, #2c1810 100%)',
          position: 'relative',
        }}
      >
        {/* Measurement marks */}
        {[0, 20, 40, 60, 80, 100].map((pos) => (
          <div
            key={pos}
            style={{
              position: 'absolute',
              left: `${pos}%`,
              top: '100%',
              width: '1px',
              height: pos % 50 === 0 ? '8px' : '4px',
              backgroundColor: '#2c1810',
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div
        style={{
          display: 'flex',
          padding: '24px',
          gap: '20px',
          position: 'relative',
          flexWrap: 'wrap',
        }}
      >
        {/* Logo Section with Technical Frame */}
        <div
          style={{
            flexShrink: 0,
            position: 'relative',
            padding: '12px',
            border: '1px dashed rgba(44, 24, 16, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Corner accents */}
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              width: '8px',
              height: '8px',
              borderTop: '2px solid #2c1810',
              borderLeft: '2px solid #2c1810',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '8px',
              height: '8px',
              borderTop: '2px solid #2c1810',
              borderRight: '2px solid #2c1810',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              width: '8px',
              height: '8px',
              borderBottom: '2px solid #2c1810',
              borderLeft: '2px solid #2c1810',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '8px',
              height: '8px',
              borderBottom: '2px solid #2c1810',
              borderRight: '2px solid #2c1810',
            }}
          />

          <img
            src={logoUrl}
            alt="ULTRACTION"
            style={{
              width: '80px',
              height: 'auto',
              display: 'block',
            }}
          />

          {/* Technical annotation below logo */}
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '8px',
              color: '#2c1810',
              textAlign: 'center',
              marginTop: '4px',
              opacity: 0.7,
            }}
          >
            FIG. 1.0 | REF: UGC-LOGO
          </div>
        </div>

        {/* Information Section */}
        <div
          style={{
            flex: 1,
            minWidth: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Name and Title */}
          <div>
            <h1
              style={{
                fontFamily: "'Public Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#141414',
                margin: '0 0 2px 0',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {name}
            </h1>
            <div
              style={{
                display: 'inline-block',
                fontFamily: "'Public Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#2c1810',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '2px 8px',
                backgroundColor: 'rgba(44, 24, 16, 0.1)',
                border: '1px solid rgba(44, 24, 16, 0.2)',
              }}
            >
              {title}
            </div>
          </div>

          {/* Divider Line with Technical Mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '4px 0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #2c1810, transparent)',
              }}
            />
            <div
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#2c1810',
                transform: 'rotate(45deg)',
                margin: '0 8px',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #2c1810, transparent)',
              }}
            />
          </div>

          {/* Contact Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '4px 12px',
              fontSize: '12px',
              color: '#141414',
            }}
          >
            {/* Email */}
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#2c1810',
                fontSize: '10px',
              }}
            >
              E-MAIL:
            </div>
            <div>
              <a
                href={`mailto:${email}`}
                style={{
                  color: '#141414',
                  textDecoration: 'none',
                  borderBottom: '1px dotted #2c1810',
                }}
              >
                {email}
              </a>
            </div>

            {/* Phone */}
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#2c1810',
                fontSize: '10px',
              }}
            >
              TEL:
            </div>
            <div>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                style={{
                  color: '#141414',
                  textDecoration: 'none',
                  borderBottom: '1px dotted #2c1810',
                }}
              >
                {phone}
              </a>
            </div>

            {/* Website */}
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#2c1810',
                fontSize: '10px',
              }}
            >
              WEB:
            </div>
            <div>
              <a
                href={`https://${website}`}
                style={{
                  color: '#141414',
                  textDecoration: 'none',
                  borderBottom: '1px dotted #2c1810',
                }}
              >
                {website}
              </a>
            </div>

            {/* Address */}
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#2c1810',
                fontSize: '10px',
              }}
            >
              LOC:
            </div>
            <div>{address}</div>

            {/* License Number */}
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                color: '#2c1810',
                fontSize: '10px',
              }}
            >
              LICENSE:
            </div>
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: '#2c1810',
                fontWeight: 600,
              }}
            >
              {licenseNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Border */}
      <div
        style={{
          padding: '0 24px 12px',
          position: 'relative',
        }}
      >
        {/* Company Name with Technical Styling */}
        <div
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            color: '#2c1810',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            textAlign: 'center',
            padding: '8px 0',
            borderTop: '1px solid rgba(44, 24, 16, 0.2)',
            borderBottom: '1px solid rgba(44, 24, 16, 0.2)',
            position: 'relative',
          }}
        >
          {/* Left bracket */}
          <span
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              opacity: 0.5,
            }}
          >
            [
          </span>
          ULTRACTION GENERAL CONTRACTING LLC
          {/* Right bracket */}
          <span
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              opacity: 0.5,
            }}
          >
            ]
          </span>
        </div>

        {/* Technical Reference */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '8px',
            color: '#2c1810',
            textAlign: 'center',
            marginTop: '6px',
            opacity: 0.5,
          }}
        >
          SIG_v3.0 | TECHNICAL SPECIFICATION | DOC ID: UGC-ES-003
        </div>

        {/* Scale indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '8px',
              color: '#2c1810',
              opacity: 0.6,
            }}
          >
            SCALE 1:1
          </div>
          <div
            style={{
              width: '30px',
              height: '1px',
              backgroundColor: '#2c1810',
              marginLeft: '4px',
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* Bottom Border */}
      <div
        style={{
          height: '3px',
          background: `repeating-linear-gradient(
            90deg,
            #141414 0px,
            #141414 4px,
            transparent 4px,
            transparent 8px
          )`,
        }}
      />
    </div>
  );
};

export default TechnicalBlueprintSignature;
