import Image from 'next/image';

/* 
========================================
HOW TO ADD YOUR COMPANY LOGO
========================================
1. Save your logo as PNG with transparent background
2. Place it in the /public folder as "logo.png"
3. In this file, replace the gradient "A" div with:

    <Image 
      src="/logo.png" 
      width={140} 
      height={36} 
      alt="Your Company Logo"
      style={{ objectFit: 'contain' }}
    />

4. Remove the gradient box and text divs below it
========================================
*/

export default function Logo() {
  return (
    <div style={{
      padding: '20px 20px 16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* 
        LOGO PLACEHOLDER
        To replace with your logo:
        1. Add your logo file to /public/logo.png
        2. Change the src below to "/logo.png"
        3. Adjust width and height as needed
      */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Logo image - replace src with your logo */}
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
          A
        </div>
        <div>
          <div style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            lineHeight: '1.2',
            letterSpacing: '-0.3px'
          }}>
            Analyzehive
          </div>
          <div style={{
            color: '#60A5FA',
            fontWeight: '500',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Flow
          </div>
        </div>
      </div>
    </div>
  );
}
