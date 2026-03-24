import React, { useState } from 'react';

const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
  >
    <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const businessLines = ['Corporate Services', 'Fund Services', 'Financial Services'];

const entityTypesByLine = {
  'Corporate Services': ['Private Company', 'Public Company', 'Foundation', 'Trust'],
  'Fund Services': ['Private Company', 'Foundation', 'Trust'],
  'Financial Services': ['Private Company', 'Public Company'],
};

const entitySubTypes = ['LLC', 'Ltd', 'PLC', 'GmbH'];

const RequiredLabel = ({ children }) => (
  <label
    className="block text-sm font-medium mb-1"
    style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
  >
    {children} <span style={{ color: '#EF4444' }}>*</span>
  </label>
);

const SelectWrapper = ({ value, onChange, children, disabled }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      style={{ fontFamily: 'Open Sans, sans-serif', color: value ? '#001F3F' : '#9CA3AF' }}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <ChevronDown />
    </div>
  </div>
);

export default function FormSection({ selectedJurisdiction }) {
  const [businessLine, setBusinessLine] = useState('');
  const [entityType, setEntityType] = useState('');
  const [entitySubType, setEntitySubType] = useState('');

  const handleBusinessLineChange = (e) => {
    setBusinessLine(e.target.value);
    setEntityType('');
    setEntitySubType('');
  };

  const handleEntityTypeChange = (e) => {
    setEntityType(e.target.value);
    setEntitySubType('');
  };

  const availableEntityTypes = businessLine ? (entityTypesByLine[businessLine] || []) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessLine || !entityType || !entitySubType) {
      alert('Please fill in all required fields.');
      return;
    }
    alert(`Submitting:\nJurisdiction: ${selectedJurisdiction?.name || 'None'}\nBusiness Line: ${businessLine}\nEntity Type: ${entityType}\nEntity SubType: ${entitySubType}`);
  };

  return (
    <div
      className="bg-white p-6"
      style={{ borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)' }}
    >
      {/* Section Header */}
      <div className="mb-6">
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}
        >
          Configure Your Entity
        </h2>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Select your business requirements to get started
          {selectedJurisdiction ? ` in ${selectedJurisdiction.name}` : ''}.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Business Lines */}
          <div>
            <RequiredLabel>Business Lines</RequiredLabel>
            <SelectWrapper value={businessLine} onChange={handleBusinessLineChange}>
              <option value="" disabled>Select business line</option>
              {businessLines.map((line) => (
                <option key={line} value={line}>{line}</option>
              ))}
            </SelectWrapper>
          </div>

          {/* Entity Type */}
          <div>
            <RequiredLabel>Entity Type</RequiredLabel>
            <SelectWrapper
              value={entityType}
              onChange={handleEntityTypeChange}
              disabled={!businessLine}
            >
              <option value="" disabled>
                {businessLine ? 'Select entity type' : 'Select business line first'}
              </option>
              {availableEntityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </SelectWrapper>
          </div>

          {/* Entity SubType */}
          <div>
            <RequiredLabel>Entity SubType</RequiredLabel>
            <SelectWrapper
              value={entitySubType}
              onChange={(e) => setEntitySubType(e.target.value)}
              disabled={!entityType}
            >
              <option value="" disabled>
                {entityType ? 'Select entity subtype' : 'Select entity type first'}
              </option>
              {entitySubTypes.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </SelectWrapper>
          </div>
        </div>

        {/* Summary row */}
        {(selectedJurisdiction || businessLine || entityType || entitySubType) && (
          <div
            className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl"
            style={{ backgroundColor: '#F0F7FF', border: '1px solid #DBEAFE' }}
          >
            <span className="text-xs font-medium" style={{ color: '#001F3F' }}>Selection:</span>
            {selectedJurisdiction && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#155DFC] text-white">
                {selectedJurisdiction.name}
              </span>
            )}
            {businessLine && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{businessLine}</span>
            )}
            {entityType && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{entityType}</span>
            )}
            {entitySubType && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{entitySubType}</span>
            )}
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#155DFC', fontFamily: 'Inter, sans-serif' }}
          >
            Get Started →
          </button>
        </div>
      </form>
    </div>
  );
}
