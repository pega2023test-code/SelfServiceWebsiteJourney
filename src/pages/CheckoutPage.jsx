import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const dialingCodes = [
  { code: '+1',   label: '🇺🇸 +1 (US/CA)' },
  { code: '+44',  label: '🇬🇧 +44 (UK)' },
  { code: '+61',  label: '🇦🇺 +61 (AU)' },
  { code: '+91',  label: '🇮🇳 +91 (IN)' },
  { code: '+65',  label: '🇸🇬 +65 (SG)' },
  { code: '+852', label: '🇭🇰 +852 (HK)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+974', label: '🇶🇦 +974 (QA)' },
  { code: '+966', label: '🇸🇦 +966 (SA)' },
  { code: '+49',  label: '🇩🇪 +49 (DE)' },
  { code: '+33',  label: '🇫🇷 +33 (FR)' },
  { code: '+41',  label: '🇨🇭 +41 (CH)' },
  { code: '+352', label: '🇱🇺 +352 (LU)' },
  { code: '+356', label: '🇲🇹 +356 (MT)' },
  { code: '+230', label: '🇲🇺 +230 (MU)' },
  { code: '+55',  label: '🇧🇷 +55 (BR)' },
  { code: '+52',  label: '🇲🇽 +52 (MX)' },
  { code: '+27',  label: '🇿🇦 +27 (ZA)' },
  { code: '+84',  label: '🇻🇳 +84 (VN)' },
  { code: '+86',  label: '🇨🇳 +86 (CN)' },
];

const serviceIcons = {
  Company: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="1" stroke="#155DFC" strokeWidth="2" />
      <line x1="10" y1="7" x2="14" y2="7" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="11" x2="14" y2="11" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="15" x2="14" y2="15" stroke="#155DFC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Trust: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z" stroke="#155DFC" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  Fund: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#155DFC" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Third Party': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" stroke="#155DFC" strokeWidth="2" />
      <circle cx="17" cy="9" r="2" stroke="#155DFC" strokeWidth="2" />
      <path d="M3 21v-1a6 6 0 0112 0v1" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 13a4 4 0 014 4v1" stroke="#155DFC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const ClockIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="2" />
    <path d="M12 7v5l3 3" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], jurisdiction } = location.state || {};
  const jurisdictionName = jurisdiction?.name || '';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dialingCode: '+1',
    phone: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid phone number';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  }

  const inputStyle = (fieldName) => ({
    width: '100%', height: 40, padding: '0 12px',
    border: `1px solid ${errors[fieldName] ? '#EF4444' : '#D1D5DB'}`,
    borderRadius: 8, fontSize: 13, fontFamily: 'Inter, sans-serif',
    color: '#0A0A0A', backgroundColor: '#fff', outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    fontSize: 12, fontWeight: 500, color: '#374151',
    fontFamily: 'Inter, sans-serif', marginBottom: 5, display: 'block',
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#DEE6EC', fontFamily: 'Inter, sans-serif' }}>
        <Navbar />
        <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 16, padding: '48px 40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              width: 56, height: 56, backgroundColor: '#D1FAE5', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#001F3F', margin: '0 0 10px 0' }}>Enquiry Submitted!</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: '22px', margin: '0 0 28px 0' }}>
              Thank you, <strong>{form.firstName}</strong>. Our team will review your selection and reach out to you at <strong>{form.email}</strong> shortly.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                height: 40, padding: '0 28px', backgroundColor: '#155DFC', color: '#fff',
                border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600,
                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#DEE6EC', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Back button */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 48px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 13, fontWeight: 500, color: '#001F3F',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M11 6l-6 6 6 6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Product Selection
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 48px 48px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0A0A0A', margin: '0 0 4px 0' }}>Review & Capture Details</h1>
          <p style={{ fontSize: 13, color: '#4A5565', margin: 0 }}>Review your selected products and provide your contact details to proceed</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start' }}>

          {/* ── Left: cart summary ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Order summary card */}
            <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#001F3F', margin: 0 }}>Order Summary</h2>
                <span style={{
                  backgroundColor: '#DBEAFE', color: '#1D4ED8',
                  borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600,
                }}>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              </div>

              {cartItems.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '24px 0' }}>No items in cart.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cartItems.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 14px', backgroundColor: '#F9FAFB',
                      borderRadius: 10, border: '1px solid #F3F4F6',
                    }}>
                      <div style={{
                        width: 30, height: 30, backgroundColor: '#DBEAFE', borderRadius: 7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {serviceIcons[item.service] || serviceIcons.Company}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A', margin: '0 0 2px 0' }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 4px 0' }}>
                          {item.jurisdiction} · {item.service}
                        </p>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#9CA3AF' }}>
                          <ClockIcon /> {item.timeline}
                        </span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#001F3F', flexShrink: 0 }}>
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 10 }}>
                    <span>Government fees</span>
                    <span>Varies by jurisdiction</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#001F3F' }}>
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Jurisdiction info pill */}
            {jurisdictionName && (
              <div style={{
                backgroundColor: '#fff', borderRadius: 10, padding: '12px 16px',
                border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, backgroundColor: '#DBEAFE', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#155DFC" />
                    <circle cx="12" cy="9" r="2.5" fill="white" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 1px 0' }}>Selected Jurisdiction</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#001F3F', margin: 0 }}>{jurisdictionName}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: contact details form ── */}
          <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#001F3F', margin: '0 0 6px 0' }}>Contact Details</h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 20px 0' }}>
              Please provide your details so we can follow up with your enquiry.
            </p>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* First name + Last name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>First Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                    style={inputStyle('firstName')}
                  />
                  {errors.firstName && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0 0' }}>{errors.firstName}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name <span style={{ color: '#EF4444' }}>*</span></label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Smith"
                    style={inputStyle('lastName')}
                  />
                  {errors.lastName && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0 0' }}>{errors.lastName}</p>}
                </div>
              </div>

              {/* Phone: dialing code + number */}
              <div>
                <label style={labelStyle}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    name="dialingCode"
                    value={form.dialingCode}
                    onChange={handleChange}
                    style={{
                      height: 40, padding: '0 10px',
                      border: '1px solid #D1D5DB', borderRadius: 8,
                      fontSize: 12, fontFamily: 'Inter, sans-serif',
                      color: '#0A0A0A', backgroundColor: '#fff',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {dialingCodes.map((d) => (
                      <option key={d.code} value={d.code}>{d.label}</option>
                    ))}
                  </select>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    style={{ ...inputStyle('phone'), flex: 1 }}
                  />
                </div>
                {errors.phone && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0 0' }}>{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  style={inputStyle('email')}
                />
                {errors.email && <p style={{ fontSize: 11, color: '#EF4444', margin: '4px 0 0 0' }}>{errors.email}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  width: '100%', height: 42, marginTop: 4,
                  backgroundColor: '#155DFC', color: '#fff',
                  border: 'none', borderRadius: 9,
                  fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Submit Enquiry →
              </button>

              <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', margin: 0, lineHeight: '16px' }}>
                By submitting, you agree to be contacted by an Amicorp representative regarding your enquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
