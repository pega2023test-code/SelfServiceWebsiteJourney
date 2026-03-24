import React from 'react';

export default function HeroSection() {
  return (
    <div className="py-3 text-center">
      <h1
        className="text-2xl font-medium mb-1.5 leading-tight"
        style={{ fontFamily: 'Inter, sans-serif', color: '#001F3F' }}
      >
        Welcome to Amicorp{' '}
        <span style={{ color: '#155DFC' }}>Global Incorporator</span>
      </h1>
      <p
        className="text-xs leading-relaxed max-w-xl mx-auto"
        style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}
      >
        Your global journey starts here. Backed by 40+ offices in 30+ countries, Amicorp provides
        tailored corporate, financial, and fund solutions designed to support your cross-border growth.
        Tell us where you want to go, we'll help you get there.
      </p>
    </div>
  );
}
