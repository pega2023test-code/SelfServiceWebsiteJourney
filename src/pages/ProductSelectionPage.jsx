import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getServicesForJurisdiction, getProductsForJurisdictionAndService } from '../data/products.js';

// ── Product metadata ───────────────────────────────────────────────────────────
const serviceDefaults = {
  Company: {
    price: 2500,
    timeline: '3–5 weeks',
    description: (name, jur) =>
      `Incorporate a ${name} in ${jur} with full legal compliance and registered agent services.\nIncludes corporate secretarial, bank account facilitation and ongoing maintenance.`,
  },
  Trust: {
    price: 5500,
    timeline: '4–8 weeks',
    description: (name, jur) =>
      `Establish a ${name} in ${jur} for robust asset protection and succession planning.\nIncludes trust deed drafting, trustee appointment and beneficiary management.`,
  },
  Fund: {
    price: 12000,
    timeline: '8–14 weeks',
    description: (name, jur) =>
      `Set up a ${name} fund structure in ${jur} with full regulatory licensing support.\nIncludes NAV administration, investor onboarding and compliance monitoring.`,
  },
  'Third Party': {
    price: 1800,
    timeline: '2–3 weeks',
    description: (name) =>
      `Establish a ${name} through a related or third-party arrangement for flexible structuring.\nSuitable for holding, operating or special-purpose entity requirements.`,
  },
};

const productPriceOverrides = {
  'ADGM SPV': 4500, 'ADGM - Private Limited Company': 5200, 'DIFC Private Limited Company': 6000,
  'DIFC Incorporated Cell': 7500, 'SPC': 8500, 'Star Trust': 9000, 'Vista Trust': 8200,
  'VCC': 11000, 'OFC': 13000, 'SICAV': 18000, 'Exempt Company': 14000,
  'Series LLC': 7000, 'PCC': 9500, 'ICC': 9800, 'FCP': 16000,
};

function getProductMeta(service, name, jurisdiction) {
  const defaults = serviceDefaults[service] || serviceDefaults.Company;
  const price = productPriceOverrides[name] ?? defaults.price;
  const desc = defaults.description(name, jurisdiction);
  const [line1, line2] = desc.split('\n');
  return { price, timeline: defaults.timeline, line1, line2 };
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const serviceIcons = {
  Company: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="1" stroke="#155DFC" strokeWidth="2" />
      <line x1="10" y1="7" x2="14" y2="7" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="11" x2="14" y2="11" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="15" x2="14" y2="15" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Trust: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z" stroke="#155DFC" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  Fund: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#155DFC" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Third Party': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke="#155DFC" strokeWidth="2" />
      <circle cx="17" cy="9" r="2" stroke="#155DFC" strokeWidth="2" />
      <path d="M3 21v-1a6 6 0 0112 0v1" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 13a4 4 0 014 4v1" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2" />
    <path d="M12 7v5l3 3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6l-1 14H6L5 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 6V4h6v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ name, service, jurisdiction, inCart, onAddToCart, onViewCart }) {
  const { price, timeline, line1, line2 } = getProductMeta(service, name, jurisdiction);

  return (
    <div style={{
      backgroundColor: '#fff',
      border: inCart ? '1.5px solid #155DFC' : '1px solid rgba(0,0,0,0.1)',
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: inCart ? '0 0 0 3px rgba(21,93,252,0.08)' : 'none',
      transition: 'border 0.15s, box-shadow 0.15s',
    }}>
      {/* Icon + badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 32, height: 32, backgroundColor: '#DBEAFE', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {serviceIcons[service] || serviceIcons.Company}
        </div>
        <span style={{
          backgroundColor: '#ECEEF2', borderRadius: 6, padding: '2px 7px',
          fontSize: 10, fontWeight: 500, color: '#030213', fontFamily: 'Inter, sans-serif',
        }}>
          {service}
        </span>
      </div>

      {/* Product name */}
      <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: '18px' }}>
        {name}
      </p>

      {/* Description */}
      <div>
        <p style={{ fontSize: 11, lineHeight: '16px', color: '#717182', fontFamily: 'Inter, sans-serif', margin: '0 0 1px 0' }}>{line1}</p>
        <p style={{ fontSize: 11, lineHeight: '16px', color: '#717182', fontFamily: 'Inter, sans-serif', margin: 0 }}>{line2}</p>
      </div>

      {/* Timeline + price row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          <ClockIcon /> {timeline}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#001F3F', fontFamily: 'Inter, sans-serif' }}>
          ${price.toLocaleString()}
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onAddToCart}
          style={{
            flex: 1, height: 28,
            border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6,
            fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif',
            backgroundColor: inCart ? '#155DFC' : '#fff',
            color: inCart ? '#fff' : '#0A0A0A',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {inCart ? 'Added ✓' : 'Add to Cart'}
        </button>
        <button
          onClick={onViewCart}
          style={{
            flex: 1, height: 28,
            border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6,
            fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif',
            backgroundColor: '#fff', color: '#0A0A0A', cursor: 'pointer',
          }}
        >
          View Cart
        </button>
      </div>
    </div>
  );
}

// ── Cart Drawer ────────────────────────────────────────────────────────────────
function CartDrawer({ cartItems, onRemove, onClose, onCheckout }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * 0.00); // no tax for now
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 200,
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 400,
        backgroundColor: '#fff',
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#001F3F', margin: 0 }}>Your Cart</h2>
            <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0 0' }}>
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 7, border: '1px solid #E5E7EB',
              backgroundColor: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: 13, margin: 0 }}>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 10,
                    border: '1px solid #F3F4F6',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, backgroundColor: '#DBEAFE', borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {serviceIcons[item.service] || serviceIcons.Company}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0A0A0A', margin: '0 0 2px 0' }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 4px 0' }}>
                      {item.jurisdiction} · {item.service}
                    </p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#9CA3AF' }}>
                      <ClockIcon /> {item.timeline}
                    </span>
                  </div>

                  {/* Price + remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#001F3F' }}>
                      ${item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onRemove(item.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                      title="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary + checkout */}
        {cartItems.length > 0 && (
          <div style={{
            borderTop: '1px solid #E5E7EB',
            padding: '16px 20px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280' }}>
                <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280' }}>
                <span>Government fees</span>
                <span>Varies by jurisdiction</span>
              </div>
              <div style={{ height: 1, backgroundColor: '#E5E7EB', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#001F3F' }}>
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              style={{
                width: '100%', height: 40,
                backgroundColor: '#155DFC', color: '#fff',
                border: 'none', borderRadius: 9,
                fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}>
              Proceed to Checkout →
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%', height: 34,
                backgroundColor: '#fff', color: '#374151',
                border: '1px solid #E5E7EB', borderRadius: 9,
                fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProductSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const jurisdiction = location.state?.jurisdiction;
  const jurisdictionName = jurisdiction?.name || '';

  const services = getServicesForJurisdiction(jurisdictionName);
  const [activeService, setActiveService] = useState(services[0] || '');
  // cart: { [productName]: { name, service, jurisdiction, price, timeline } }
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const products = getProductsForJurisdictionAndService(jurisdictionName, activeService);
  const cartItems = Object.values(cart);
  const cartCount = cartItems.length;

  function toggleCart(name) {
    setCart((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      const { price, timeline } = getProductMeta(activeService, name, jurisdictionName);
      return { ...prev, [name]: { name, service: activeService, jurisdiction: jurisdictionName, price, timeline } };
    });
  }

  function removeFromCart(name) {
    setCart((prev) => { const next = { ...prev }; delete next[name]; return next; });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#DEE6EC', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Back button */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '12px 48px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#001F3F', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M11 6l-6 6 6 6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Jurisdiction Selection
        </button>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '12px 48px 48px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            width: '100%', height: 110, borderRadius: 14, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, #0f2447 0%, #1a3a6e 35%, #2d5ba8 65%, #0f2447 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.2 }}
              viewBox="0 0 1200 80" preserveAspectRatio="none">
              <path d="M0,55 L40,55 L40,30 L60,30 L60,15 L80,15 L80,30 L100,30 L100,45 L130,45 L130,20 L150,20 L150,5 L170,5 L170,20 L190,20 L190,40 L220,40 L220,18 L240,18 L240,3 L260,3 L260,18 L280,18 L280,38 L310,38 L310,22 L330,22 L330,8 L350,8 L350,22 L370,22 L370,42 L400,42 L400,18 L420,18 L420,2 L440,2 L440,18 L460,18 L460,35 L490,35 L490,22 L510,22 L510,8 L530,8 L530,22 L550,22 L550,38 L580,38 L580,18 L600,18 L600,35 L630,35 L630,20 L650,20 L650,6 L670,6 L670,20 L690,20 L690,38 L720,38 L720,45 L750,45 L750,28 L770,28 L770,12 L790,12 L790,28 L810,28 L810,42 L840,42 L840,25 L860,25 L860,42 L890,42 L890,55 L920,55 L920,35 L940,35 L940,20 L960,20 L960,35 L990,35 L990,50 L1020,50 L1020,35 L1050,35 L1050,50 L1080,50 L1080,60 L1110,60 L1110,70 L1200,70 L1200,80 L0,80 Z" fill="white" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)' }} />
            <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="8" height="10" viewBox="0 0 12 16" fill="none">
                    <path d="M6 0C2.69 0 0 2.69 0 6c0 4.5 6 10 6 10s6-5.5 6-10C6 2.69 3.31 0 6 0z" fill="white" />
                    <circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.4)" />
                  </svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 500 }}>Selected Jurisdiction</span>
              </div>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: '24px', margin: '0 0 1px 0' }}>
                Your Advantage in {jurisdictionName || 'Global Markets'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, margin: 0 }}>Strategic gateway to global opportunities</p>
            </div>
          </div>
        </div>

        {/* Page heading + cart button row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: '#0A0A0A', margin: '0 0 4px 0' }}>Select Your Product Type</h1>
            <p style={{ fontSize: 14, color: '#4A5565', margin: 0 }}>Choose the legal structure that best suits your business needs</p>
          </div>

          {/* Cart icon button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 9,
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: cartCount > 0 ? '#001F3F' : '#fff',
              color: cartCount > 0 ? '#fff' : '#374151',
              fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View Cart
            {cartCount > 0 && (
              <span style={{
                backgroundColor: '#155DFC', color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Tabs + products */}
        {services.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Tab strip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECECF0', borderRadius: 14, padding: '3.5px 3px', gap: 2 }}>
              {services.map((svc) => (
                <button key={svc} onClick={() => setActiveService(svc)}
                  style={{
                    height: 29, padding: '0 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    backgroundColor: activeService === svc ? '#001F3F' : 'transparent',
                    color: activeService === svc ? '#fff' : '#0A0A0A',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {svc}
                </button>
              ))}
            </div>

            {/* Section label */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 500, color: '#0A0A0A', margin: '0 0 2px 0' }}>{activeService}</h2>
              <p style={{ fontSize: 13, color: '#4A5565', margin: 0 }}>
                {products.length} product{products.length !== 1 ? 's' : ''} available in {jurisdictionName}
              </p>
            </div>

            {/* Product grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {products.map((name) => (
                <ProductCard
                  key={name}
                  name={name}
                  service={activeService}
                  jurisdiction={jurisdictionName}
                  inCart={!!cart[name]}
                  onAddToCart={() => toggleCart(name)}
                  onViewCart={() => setCartOpen(true)}
                />
              ))}
            </div>

            {/* Need Help */}
            <div style={{
              backgroundColor: '#fff', border: '1px solid #BEDBFF', borderRadius: 14,
              padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" stroke="#155DFC" strokeWidth="2" />
                <line x1="12" y1="16" x2="12" y2="12" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1" fill="#155DFC" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: '#0A0A0A', margin: '0 0 4px 0' }}>Need Help Choosing?</h3>
                  <p style={{ fontSize: 13, lineHeight: '19px', color: '#364153', margin: 0 }}>
                    Not sure which product type is right for your business? Our team of experts can help you select the optimal structure based on your specific requirements, tax considerations, and business goals.
                  </p>
                </div>
                <button style={{
                  width: 160, height: 32, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 7,
                  backgroundColor: '#fff', fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                  color: '#0A0A0A', cursor: 'pointer',
                }}>
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280', fontSize: 14 }}>
            No products found for <strong>{jurisdictionName}</strong>.
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          cartItems={cartItems}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            navigate('/checkout', { state: { cartItems, jurisdiction } });
          }}
        />
      )}
    </div>
  );
}
