import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LocationPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#155DFC" />
    <circle cx="12" cy="9" r="2.5" fill="white" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const regionColors = {
  'Asia Pacific': 'bg-blue-100 text-blue-700',
  'Africa': 'bg-green-100 text-green-700',
  'Caribbean': 'bg-cyan-100 text-cyan-700',
  'Europe': 'bg-purple-100 text-purple-700',
  'Middle East': 'bg-orange-100 text-orange-700',
  'North America': 'bg-red-100 text-red-700',
};

export default function JurisdictionPanel({ jurisdictions, selectedJurisdiction, onSelect, selectedRegion }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // tracks whether current selection came from the dropdown (enables Proceed)
  const [dropdownSelected, setDropdownSelected] = useState(false);
  const dropdownRef = useRef(null);

  // If parent clears selection (e.g. region change), reset dropdown flag too
  useEffect(() => {
    if (!selectedJurisdiction) setDropdownSelected(false);
  }, [selectedJurisdiction]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredList = useMemo(() => {
    return jurisdictions.filter((j) => {
      const regionMatch = selectedRegion === 'All Regions' || j.region === selectedRegion;
      const searchMatch = j.name.toLowerCase().includes(searchQuery.toLowerCase());
      return regionMatch && searchMatch;
    });
  }, [jurisdictions, selectedRegion, searchQuery]);

  function handleDropdownSelect(jurisdiction) {
    onSelect(jurisdiction);
    setDropdownSelected(true);
    setDropdownOpen(false);
    setSearchQuery('');
  }

  function handleClear() {
    onSelect(null);
    setDropdownSelected(false);
    setSearchQuery('');
  }

  function handleProceed() {
    if (!selectedJurisdiction || !dropdownSelected) return;
    navigate('/products', { state: { jurisdiction: selectedJurisdiction } });
  }

  // Map marker "Explore" button also routes
  function handleExplore() {
    if (!selectedJurisdiction) return;
    navigate('/products', { state: { jurisdiction: selectedJurisdiction } });
  }

  const proceedEnabled = !!selectedJurisdiction && dropdownSelected;

  return (
    <div className="flex flex-col gap-3">

      {/* ── 1. Dropdown search ── */}
      <div ref={dropdownRef} className="relative">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Select Jurisdiction..."
            className="flex-grow border border-gray-200 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 bg-white"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          />
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="px-3 py-2 border border-l-0 border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M6 9l6 6 6-6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="px-3 py-2 rounded-r flex items-center justify-center"
            style={{ backgroundColor: '#001F3F' }}
            onClick={() => setDropdownOpen(true)}
          >
            <SearchIcon />
          </button>
        </div>

        {dropdownOpen && (
          <div
            className="absolute z-50 left-0 right-0 border border-t-0 border-gray-200 rounded-b bg-white overflow-y-auto shadow-lg"
            style={{ maxHeight: '200px' }}
          >
            {filteredList.length === 0 ? (
              <div className="py-4 px-3 text-sm text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                No jurisdictions found
              </div>
            ) : (
              filteredList.map((jurisdiction) => {
                const isSelected = selectedJurisdiction && selectedJurisdiction.id === jurisdiction.id;
                return (
                  <button
                    key={jurisdiction.id}
                    onClick={() => handleDropdownSelect(jurisdiction)}
                    className={`w-full text-left py-2 px-3 text-sm flex items-center gap-2 transition-colors ${
                      isSelected ? 'bg-[#155DFC] text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div className="rounded-full flex-shrink-0" style={{
                      width: 8, height: 8,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : jurisdiction.popular ? '#FE9A00' : '#155DFC',
                    }} />
                    {jurisdiction.name}
                    <span className={`ml-auto text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                      {jurisdiction.region}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── 2. Info card ── */}
      <div className="bg-white p-4" style={{ borderRadius: '14px', border: '2px solid #D1D5DC' }}>
        {!selectedJurisdiction ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
              <LocationPinIcon />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>
                Select a Jurisdiction
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4A5565', fontFamily: 'Inter, sans-serif' }}>
                Use the dropdown above or click a map marker to explore available services
              </p>
            </div>
            <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full flex-shrink-0" style={{ width: 12, height: 12, backgroundColor: '#FE9A00' }} />
                <span className="text-xs" style={{ color: '#6A7282', fontFamily: 'Inter, sans-serif' }}>Gold markers = Popular jurisdictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full flex-shrink-0" style={{ width: 12, height: 12, backgroundColor: '#155DFC' }} />
                <span className="text-xs" style={{ color: '#6A7282', fontFamily: 'Inter, sans-serif' }}>Blue markers = All jurisdictions</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <LocationPinIcon />
                  <h3 className="text-lg font-semibold" style={{ color: '#0A0A0A', fontFamily: 'Inter, sans-serif' }}>
                    {selectedJurisdiction.name}
                  </h3>
                </div>
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${regionColors[selectedJurisdiction.region] || 'bg-gray-100 text-gray-700'}`}>
                  {selectedJurisdiction.region}
                </span>
                {selectedJurisdiction.popular && (
                  <span className="inline-flex items-center gap-1 ml-2 text-xs" style={{ color: '#6A7282' }}>
                    <span className="inline-block rounded-full" style={{ width: 8, height: 8, backgroundColor: '#FE9A00' }} />
                    Popular
                  </span>
                )}
              </div>
              <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
                <XIcon />
              </button>
            </div>

            {/* Services */}
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB' }}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#001F3F' }}>
                Services in {selectedJurisdiction.name}
              </p>
              <ul className="text-sm space-y-1" style={{ color: '#4B5563' }}>
                <li className="flex items-center gap-2"><span className="text-[#155DFC]">✓</span> Corporate Services</li>
                <li className="flex items-center gap-2"><span className="text-[#155DFC]">✓</span> Fund Administration</li>
                <li className="flex items-center gap-2"><span className="text-[#155DFC]">✓</span> Financial Services</li>
                <li className="flex items-center gap-2"><span className="text-[#155DFC]">✓</span> Compliance & Advisory</li>
              </ul>
            </div>

            {/* Explore button (from map click) — always visible when jurisdiction is selected */}
            <button
              onClick={handleExplore}
              className="w-full py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#4B5563', fontFamily: 'Inter, sans-serif' }}
            >
              Explore {selectedJurisdiction.name} Services
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* ── 3. Proceed button — only active when selected via dropdown ── */}
            <button
              onClick={handleProceed}
              disabled={!proceedEnabled}
              title={!proceedEnabled ? 'Please select a jurisdiction from the dropdown first' : ''}
              className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: proceedEnabled ? '#155DFC' : '#E5E7EB',
                color: proceedEnabled ? '#fff' : '#9CA3AF',
                cursor: proceedEnabled ? 'pointer' : 'not-allowed',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {proceedEnabled ? (
                <>
                  Proceed with {selectedJurisdiction.name}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                'Select from dropdown to Proceed'
              )}
            </button>

          </div>
        )}
      </div>

    </div>
  );
}
