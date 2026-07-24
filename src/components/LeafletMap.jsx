import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Navigation } from 'lucide-react';
import L from 'leaflet';

// Velmurugan Store Location (T-Nagar, Chennai)
const STORE_LAT = 13.0418;
const STORE_LNG = 80.2341;

export default function LeafletMap({ onLocationSelected, initialLat, initialLng }) {
  const { t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addressName, setAddressName] = useState('Anna Nagar, Chennai, Tamil Nadu');

  // Haversine formula for distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  // Resolve coordinates to a nice mock address based on Chennai geography
  const getMockAddress = (lat, lng) => {
    const distFromStore = calculateDistance(STORE_LAT, STORE_LNG, lat, lng);
    if (distFromStore < 1.0) {
      return "T. Nagar Market Road, T. Nagar, Chennai 600017";
    } else if (lat > 13.07) {
      return "12th Main Road, Anna Nagar, Chennai 600040";
    } else if (lat < 13.02) {
      return "Besant Avenue Road, Adyar, Chennai 600020";
    } else if (lng > 80.25) {
      return "Santhome High Road, Mylapore, Chennai 600004";
    } else {
      return "Sterling Road, Nungambakkam, Chennai 600034";
    }
  };

  useEffect(() => {
    // Initialize map if it doesn't exist
    if (!mapRef.current && mapContainerRef.current) {
      const initialLatVal = initialLat || 13.0827;
      const initialLngVal = initialLng || 80.2707;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([initialLatVal, initialLngVal], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Add zoom control to bottom right for premium styling
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      // Custom Gold Crown Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative w-10 h-10 flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-primary border-2 border-accent shadow-lg animate-ping opacity-25"></div>
            <div class="absolute w-6 h-6 rounded-full bg-primary border border-accent flex items-center justify-center shadow-lg">
              <div class="w-2.5 h-2.5 rounded-full bg-accent"></div>
            </div>
            <div class="absolute -bottom-1 w-2.5 h-2.5 bg-accent transform rotate-45 border-r border-b border-accent/40"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 35]
      });

      // Pinned location marker
      const marker = L.marker([initialLatVal, initialLngVal], {
        icon: customIcon,
        draggable: true
      }).addTo(map);

      // Add store location marker to visualize distance
      const storeIcon = L.divIcon({
        className: 'custom-store-marker',
        html: `
          <div class="relative w-12 h-12 flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-xl bg-accent border border-white flex items-center justify-center shadow-lg">
              <span class="text-[9px] font-black text-primary font-sans leading-none text-center">V<br/>STORE</span>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      L.marker([STORE_LAT, STORE_LNG], { icon: storeIcon }).addTo(map);

      // Handle marker drag
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        const dist = calculateDistance(STORE_LAT, STORE_LNG, position.lat, position.lng);
        const addr = getMockAddress(position.lat, position.lng);
        setAddressName(addr);
        onLocationSelected(position.lat, position.lng, addr, dist);
      });

      // Handle map click to reposition marker
      map.on('click', (e) => {
        const position = e.latlng;
        marker.setLatLng(position);
        const dist = calculateDistance(STORE_LAT, STORE_LNG, position.lat, position.lng);
        const addr = getMockAddress(position.lat, position.lng);
        setAddressName(addr);
        onLocationSelected(position.lat, position.lng, addr, dist);
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Initial trigger
      const dist = calculateDistance(STORE_LAT, STORE_LNG, initialLatVal, initialLngVal);
      const addr = getMockAddress(initialLatVal, initialLngVal);
      setAddressName(addr);
      onLocationSelected(initialLatVal, initialLngVal, addr, dist);
    }

    return () => {
      // Clean up map instance on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle address searches (Mock resolver for standard Chennai areas)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let targetLat = 13.0827;
    let targetLng = 80.2707;
    let resolvedAddr = searchQuery + ", Chennai, Tamil Nadu";

    const queryLower = searchQuery.toLowerCase();
    if (queryLower.includes('anna nagar')) {
      targetLat = 13.0850;
      targetLng = 80.2101;
      resolvedAddr = "12th Main Road, Anna Nagar, Chennai 600040";
    } else if (queryLower.includes('nungambakkam')) {
      targetLat = 13.0620;
      targetLng = 80.2400;
      resolvedAddr = "Sterling Road, Nungambakkam, Chennai 600034";
    } else if (queryLower.includes('t. nagar') || queryLower.includes('t nagar')) {
      targetLat = 13.0418;
      targetLng = 80.2341;
      resolvedAddr = "T. Nagar Market Road, T. Nagar, Chennai 600017";
    } else if (queryLower.includes('adyar')) {
      targetLat = 13.0063;
      targetLng = 80.2574;
      resolvedAddr = "Besant Avenue Road, Adyar, Chennai 600020";
    } else if (queryLower.includes('velachery')) {
      targetLat = 12.9815;
      targetLng = 80.2196;
      resolvedAddr = "Velachery Bypass Road, Velachery, Chennai 600042";
    }

    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([targetLat, targetLng], 14);
      markerRef.current.setLatLng([targetLat, targetLng]);
      const dist = calculateDistance(STORE_LAT, STORE_LNG, targetLat, targetLng);
      setAddressName(resolvedAddr);
      onLocationSelected(targetLat, targetLng, resolvedAddr, dist);
    }
  };

  const handleLocateMe = () => {
    // Mock user GPS trigger
    const userLat = 13.0524;
    const userLng = 80.2250;
    const resolvedAddr = "Giri Road, T Nagar, Chennai 600017";
    
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([userLat, userLng], 15);
      markerRef.current.setLatLng([userLat, userLng]);
      const dist = calculateDistance(STORE_LAT, STORE_LNG, userLat, userLng);
      setAddressName(resolvedAddr);
      onLocationSelected(userLat, userLng, resolvedAddr, dist);
    }
  };

  return (
    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden border border-gray-150 shadow-inner">
      {/* Search Address Bar */}
      <form onSubmit={handleSearch} className="absolute top-3 left-3 right-3 z-10 flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder={t('searchLocPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-[11px] font-medium bg-white rounded-xl shadow-md border border-gray-100 focus:outline-none focus:border-primary"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        <button 
          type="button" 
          onClick={handleLocateMe}
          className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition-colors duration-150 shrink-0"
          title="Locate Me"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </form>

      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '320px' }}></div>
      
      {/* Footer Info Ribbon */}
      <div className="absolute bottom-3 left-3 z-10 glass-panel px-3 py-1.5 rounded-xl border border-white text-[10px] font-bold text-primary flex items-center space-x-1.5 shadow-md max-w-[200px] truncate">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
        <span className="truncate">{addressName}</span>
      </div>
    </div>
  );
}
