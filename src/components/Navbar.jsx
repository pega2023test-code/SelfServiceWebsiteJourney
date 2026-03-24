import React, { useState } from 'react';

const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" stroke="#155DFC" strokeWidth="2" fill="none" />
    <ellipse cx="16" cy="16" rx="6" ry="14" stroke="#155DFC" strokeWidth="1.5" fill="none" />
    <line x1="2" y1="16" x2="30" y2="16" stroke="#155DFC" strokeWidth="1.5" />
    <line x1="4" y1="10" x2="28" y2="10" stroke="#155DFC" strokeWidth="1" />
    <line x1="4" y1="22" x2="28" y2="22" stroke="#155DFC" strokeWidth="1" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      stroke="#001F3F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="3" y1="6" x2="21" y2="6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M16 10a4 4 0 01-8 0"
      stroke="#001F3F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navLinks = ['Company', 'Services', 'Our News', 'Sustainability', 'Locations', 'Careers', 'Contact us'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <GlobeIcon />
          <span
            className="text-xl font-semibold tracking-widest"
            style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em' }}
          >
            AMICORP
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="px-2 xl:px-3 py-2 text-sm font-medium hover:text-[#155DFC] transition-colors whitespace-nowrap"
              style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
            >
              {link}
            </a>
          ))}
          <button
            className="flex items-center gap-1 px-2 xl:px-3 py-2 text-sm font-medium hover:text-[#155DFC] transition-colors whitespace-nowrap"
            style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
          >
            Portals <ChevronDown />
          </button>
          <button
            className="flex items-center gap-1 px-2 xl:px-3 py-2 text-sm font-medium hover:text-[#155DFC] transition-colors whitespace-nowrap"
            style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
          >
            English <ChevronDown />
          </button>
        </div>

        {/* Right side: Cart + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Shopping cart with badge */}
          <div className="relative cursor-pointer">
            <ShoppingBagIcon />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              1
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-8 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="py-2 text-sm font-medium hover:text-[#155DFC] transition-colors"
              style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
            >
              {link}
            </a>
          ))}
          <button
            className="flex items-center gap-1 py-2 text-sm font-medium hover:text-[#155DFC] transition-colors text-left"
            style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
          >
            Portals <ChevronDown />
          </button>
          <button
            className="flex items-center gap-1 py-2 text-sm font-medium hover:text-[#155DFC] transition-colors text-left"
            style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
          >
            English <ChevronDown />
          </button>
        </div>
      )}
    </nav>
  );
}
