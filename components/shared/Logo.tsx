"use client";

import { useEffect, useState } from "react";
import { Building2, Landmark, Trees, Shield, Star, Hexagon } from "lucide-react";

export default function Logo() {
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

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
      if (cookies['company_logo']) {
        setCompanyLogo(cookies['company_logo']);
      }
    }
  }, []);

  const presetIcons: Record<string, any> = {
    building: Building2,
    landmark: Landmark,
    trees: Trees,
    shield: Shield,
    star: Star,
    hexagon: Hexagon
  };

  const IconComponent = companyLogo && presetIcons[companyLogo] ? presetIcons[companyLogo] : null;

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
        {IconComponent ? (
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #0066FF, #6366F1)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #0066FF, #6366F1)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            flexShrink: 0
          }}>
            {companyName ? companyName.substring(0, 1).toUpperCase() : 'A'}
          </div>
        )}
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
          }} title={companyName || "Analyzehive"}>
            {companyName || 'Analyzehive'}
          </div>
          <div style={{
            color: '#60A5FA',
            fontWeight: '500',
            fontSize: '11px',
            fontStyle: 'italic'
          }}>
            Flow
          </div>
        </div>
      </div>
    </div>
  );
}
