import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import RegionFilter from '../components/RegionFilter.jsx';
import WorldMap from '../components/WorldMap.jsx';
import JurisdictionPanel from '../components/JurisdictionPanel.jsx';
import jurisdictions from '../data/jurisdictions.js';

export default function LandingPage() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJurisdictions = useMemo(() => {
    return jurisdictions.filter((j) => {
      const regionMatch = selectedRegion === 'All Regions' || j.region === selectedRegion;
      return regionMatch;
    });
  }, [selectedRegion]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    // Clear selection if selected jurisdiction is not in the new region
    if (selectedJurisdiction && region !== 'All Regions' && selectedJurisdiction.region !== region) {
      setSelectedJurisdiction(null);
    }
  };

  const handleMarkerClick = (jurisdiction) => {
    setSelectedJurisdiction((prev) =>
      prev && prev.id === jurisdiction.id ? null : jurisdiction
    );
  };

  const handleJurisdictionSelect = (jurisdiction) => {
    setSelectedJurisdiction(jurisdiction);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#DEE6EC' }}>
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-6 pb-4">
        <HeroSection />

        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
        />

        <div className="mt-2 flex gap-3">
          {/* Map area */}
          <div className="flex-1 min-w-0">
            <WorldMap
              jurisdictions={filteredJurisdictions}
              selectedJurisdiction={selectedJurisdiction}
              onMarkerClick={handleMarkerClick}
            />
          </div>

          {/* Side panel */}
          <div className="w-[300px] flex-shrink-0 flex flex-col gap-3">
            <JurisdictionPanel
              jurisdictions={jurisdictions}
              selectedJurisdiction={selectedJurisdiction}
              onSelect={handleJurisdictionSelect}
              selectedRegion={selectedRegion}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
