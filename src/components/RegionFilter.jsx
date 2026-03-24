import React from 'react';

const regions = [
  'All Regions',
  'Asia Pacific',
  'Africa',
  'Caribbean',
  'Europe',
  'Middle East',
  'North America',
];

export default function RegionFilter({ selectedRegion, onRegionChange }) {
  return (
    <div
      className="bg-white px-4 py-3"
      style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '14px' }}
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {regions.map((region) => {
          const isActive = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#030213] text-white'
                  : 'bg-white border border-black/10 text-[#0A0A0A] hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {region}
            </button>
          );
        })}
      </div>
    </div>
  );
}
