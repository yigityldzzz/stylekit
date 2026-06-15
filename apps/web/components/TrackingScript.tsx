'use client';

import { useEffect } from 'react';

const ADFLOW_PIXEL = 'https://adflow.digitaladexpert.de/api/conversions/pixel/cmqf4x4n1000hoe6kwemt34v0';
const CHROME_STORE = 'chromewebstore.google.com';

export default function TrackingScript() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vid = params.get('adflow_vid');
    if (vid) {
      sessionStorage.setItem('adflow_vid', vid);
      localStorage.setItem('adflow_vid', vid);
    }

    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href.includes(CHROME_STORE)) return;

      const storedVid = sessionStorage.getItem('adflow_vid') || localStorage.getItem('adflow_vid') || '';

      // Meta Pixel — Lead event
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead');
      }

      // AdFlow conversion pixel
      const img = new Image();
      img.src = `${ADFLOW_PIXEL}?value=0&sub1=${encodeURIComponent(storedVid)}&txid=sk_${Date.now()}`;
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
