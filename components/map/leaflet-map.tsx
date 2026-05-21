'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Origin {
  lat: number;
  lng: number;
  type: string;
  count: number;
}

interface LeafletMapProps {
  origins: { [key: string]: Origin };
  selectedOrigin: string | null;
}

export default function LeafletMap({ origins, selectedOrigin }: LeafletMapProps) {
  useEffect(() => {
    // Créer une carte centrée sur l'Asie
    const map = L.map('map-container', {
      center: [20, 100],
      zoom: 3,
    });

    // Ajouter OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Ajouter les marqueurs
    Object.entries(origins).forEach(([name, data]) => {
      const size = Math.max(20, Math.min(50, data.count * 3));
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${getTypeColor(data.type)};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s;
            ${selectedOrigin === name ? 'box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5);' : ''}
          ">
            ${data.count}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });

      const marker = L.marker([data.lat, data.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${name}</h3>
            <p style="margin: 4px 0; color: #666;">Type: ${getTypeLabel(data.type)}</p>
            <p style="margin: 4px 0; color: #666;">Produits: <strong>${data.count}</strong></p>
          </div>
        `);

      if (selectedOrigin === name) {
        marker.openPopup();
      }
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [origins, selectedOrigin]);

  return (
    <div
      id="map-container"
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case 'green':
      return '#10b981';
    case 'black':
      return '#8b5a3c';
    case 'oolong':
      return '#d97706';
    case 'white':
      return '#e5e7eb';
    default:
      return '#6b7280';
  }
}

function getTypeLabel(type: string) {
  const labels: { [key: string]: string } = {
    green: 'Thé Vert',
    black: 'Thé Noir',
    oolong: 'Thé Oolong',
    white: 'Thé Blanc',
    herbal: 'Tisane',
    pu_erh: 'Pu-erh',
  };
  return labels[type] || type;
}
