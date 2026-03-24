import React, { useState, useCallback } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="#155DFC"
    />
    <circle cx="12" cy="9" r="2.5" fill="white" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function WorldMap({ jurisdictions, selectedJurisdiction, onMarkerClick }) {
  const [zoom, setZoom] = useState(1.4);
  const [center, setCenter] = useState([20, 10]);
  const [zoomLocked, setZoomLocked] = useState(true);

  const handleZoomIn = useCallback(() => {
    if (zoomLocked) return;
    setZoom((z) => Math.min(z * 1.5, 8));
  }, [zoomLocked]);

  const handleZoomOut = useCallback(() => {
    if (zoomLocked) return;
    setZoom((z) => Math.max(z / 1.5, 1));
  }, [zoomLocked]);

  const handleMoveEnd = useCallback((position) => {
    if (zoomLocked) return;
    setCenter(position.coordinates);
    setZoom(position.zoom);
  }, [zoomLocked]);

  return (
    <div
      className="bg-white overflow-hidden"
      style={{ borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)' }}
    >
      {/* Map Header */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <LocationPinIcon />
          <h2 className="text-base font-semibold" style={{ color: '#001F3F', fontFamily: 'Inter, sans-serif' }}>
            Global Jurisdiction Map
          </h2>
        </div>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Click on markers to explore services in each jurisdiction
        </p>
      </div>

      {/* Map Container */}
      <div className="relative overflow-hidden" style={{ background: '#F8FAFC', height: '340px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 90,
            center: [20, 10],
          }}
          style={{ width: '100%', height: '340px' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={handleMoveEnd}
            minZoom={0.8}
            maxZoom={8}
            filterZoomEvent={() => !zoomLocked}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: '#E5E7EB', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none' },
                      hover: { fill: '#D1D5DB', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none' },
                      pressed: { fill: '#D1D5DB', stroke: '#FFFFFF', strokeWidth: 0.5, outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {jurisdictions.map((jurisdiction) => {
              const isSelected = selectedJurisdiction && selectedJurisdiction.id === jurisdiction.id;
              const markerRadius = isSelected ? 8 : jurisdiction.popular ? 6 : 5;
              const markerFill = jurisdiction.popular ? '#FE9A00' : '#155DFC';
              const markerStroke = isSelected ? '#001F3F' : '#FFFFFF';
              const markerStrokeWidth = isSelected ? 2 : 1.5;

              return (
                <Marker
                  key={jurisdiction.id}
                  coordinates={jurisdiction.coordinates}
                  onClick={() => onMarkerClick(jurisdiction)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={markerRadius}
                    fill={markerFill}
                    stroke={markerStroke}
                    strokeWidth={markerStrokeWidth}
                    style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                  />
                  {isSelected && (
                    <circle
                      r={markerRadius + 4}
                      fill="transparent"
                      stroke={markerFill}
                      strokeWidth={1}
                      strokeDasharray="3 2"
                      opacity={0.7}
                    />
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          {/* Lock / Unlock button */}
          <button
            onClick={() => setZoomLocked((prev) => !prev)}
            title={zoomLocked ? 'Unlock zoom' : 'Lock zoom'}
            className="w-8 h-8 rounded border flex items-center justify-center shadow-sm transition-colors"
            style={{
              backgroundColor: zoomLocked ? '#001F3F' : '#fff',
              borderColor: zoomLocked ? '#001F3F' : '#E5E7EB',
              color: zoomLocked ? '#fff' : '#4B5563',
            }}
          >
            {zoomLocked ? <LockIcon /> : <UnlockIcon />}
          </button>

          {/* Divider */}
          <div className="h-px bg-gray-200 mx-1" />

          <button
            onClick={handleZoomIn}
            disabled={zoomLocked}
            className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm transition-colors"
            style={{
              color: zoomLocked ? '#D1D5DB' : '#4B5563',
              cursor: zoomLocked ? 'not-allowed' : 'pointer',
            }}
            title="Zoom in"
          >
            <PlusIcon />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLocked}
            className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm transition-colors"
            style={{
              color: zoomLocked ? '#D1D5DB' : '#4B5563',
              cursor: zoomLocked ? 'not-allowed' : 'pointer',
            }}
            title="Zoom out"
          >
            <MinusIcon />
          </button>
        </div>

        {/* Lock status badge */}
        {zoomLocked && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#001F3F', color: '#fff', fontFamily: 'Inter, sans-serif' }}
          >
            <LockIcon />
            Zoom Locked
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FE9A00]"></div>
            <span className="text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Popular</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#155DFC]"></div>
            <span className="text-xs" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>All</span>
          </div>
        </div>
      </div>
    </div>
  );
}
