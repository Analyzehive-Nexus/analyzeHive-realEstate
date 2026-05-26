"use client";
import { useEffect, useState } from "react";
import logoImg from "@/public/logo.png";

export default function Logo() {
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, c) => {
        const parts = c.split('=');
        if (parts.length === 2) {
          acc[parts[0]] = decodeURIComponent(parts[1]);
        }
        return acc;
      }, {});

      if (cookies['company_name']) {
        setCompanyName(cookies['company_name']);
      }
    }
  }, []);

  return (
    <div style={{
      padding: '20px 20px 16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Custom logo.png image */}
        <div style={{
          width: '36px',
          height: '36px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <img 
            src={logoImg.src} 
            alt="flowEstate Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <div>
          <div style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '15px',
            lineHeight: '1.2',
            letterSpacing: '-0.3px',
            maxWidth: '120px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={companyName || "flowEstate"}>
            {companyName || 'flowEstate'}
          </div>
          <div style={{
            color: '#60A5FA',
            fontWeight: '550',
            fontSize: '11px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            Flow
          </div>
        </div>
      </div>
    </div>
  );
}
