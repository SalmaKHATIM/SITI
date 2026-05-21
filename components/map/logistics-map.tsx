 'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Shipment {
  id: string;
  order_number: string;
  origin_country: string;
  destination_country: string;
  status: string;
  transport_type: string;
  quality_score: number;
  current_temperature?: number;
  current_humidity?: number;
}

interface LogisticsMapProps {
  shipments: Shipment[];
  selectedShipmentId: string | null;
}

const COUNTRY_COORDS: { [key: string]: { lat: number; lng: number } } = {
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'UK': { lat: 55.3781, lng: -3.436 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'China': { lat: 35.8617, lng: 104.1954 },
};

const STATUS_COLORS: { [key: string]: string } = {
  pending: '#6b7280',
  packed: '#eab308',
  in_transit: '#3b82f6',
  customs: '#f97316',
  delivered: '#10b981',
  delayed: '#ef4444',
};

const TRANSPORT_ICONS: { [key: string]: string } = {
  air: '✈️',
  sea: '🚢',
  truck: '🚚',
  train: '🚆',
};

export default function LogisticsMap({ shipments, selectedShipmentId }: LogisticsMapProps) {
  useEffect(() => {
    // Créer une carte centrée sur le monde
    const map = L.map('logistics-map', {
      center: [20, 0],
      zoom: 2,
    });

    // Ajouter OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Ajouter les routes et marqueurs pour chaque expédition
    shipments.forEach((shipment) => {
      const origin = COUNTRY_COORDS[shipment.origin_country];
      const destination = COUNTRY_COORDS[shipment.destination_country];

      if (!origin || !destination) return;

      // Couleur basée sur le statut
      const color = STATUS_COLORS[shipment.status] || '#6b7280';

      // Tracer la ligne de livraison
      L.polyline(
        [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ],
        {
          color,
          weight: selectedShipmentId === shipment.id ? 4 : 2,
          opacity: selectedShipmentId === shipment.id ? 1 : 0.6,
          dashArray: shipment.status === 'delayed' ? '5, 5' : undefined,
        }
      ).addTo(map);

      // Marqueur d'origine
      const originIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background-color: #059669;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            📦
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      L.marker([origin.lat, origin.lng], { icon: originIcon })
        .bindPopup(
          `<div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">Origine</h3>
            <p style="margin: 4px 0; color: #666;">${shipment.origin_country}</p>
            <p style="margin: 4px 0; color: #666; font-size: 12px;">${shipment.order_number}</p>
          </div>`
        )
        .addTo(map);

      // Marqueur de destination
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 35px;
            height: 35px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${selectedShipmentId === shipment.id ? 'box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5);' : ''}
          ">
            ${TRANSPORT_ICONS[shipment.transport_type] || '📦'}
          </div>
        `,
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5],
        popupAnchor: [0, -17.5],
      });

      L.marker([destination.lat, destination.lng], { icon: destIcon })
        .bindPopup(
          `<div style="font-family: Arial, sans-serif; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${shipment.order_number}</h3>
            <p style="margin: 4px 0; color: #666;"><strong>Destination:</strong> ${shipment.destination_country}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Statut:</strong> ${shipment.status}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Transport:</strong> ${TRANSPORT_ICONS[shipment.transport_type] || '?'}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Qualité:</strong> ${shipment.quality_score.toFixed(1)}%</p>
            ${shipment.current_temperature ? `<p style="margin: 4px 0; color: #666;"><strong>Temp:</strong> ${shipment.current_temperature.toFixed(1)}°C</p>` : ''}
            ${shipment.current_humidity ? `<p style="margin: 4px 0; color: #666;"><strong>Humidité:</strong> ${shipment.current_humidity.toFixed(1)}%</p>` : ''}
          </div>`
        )
        .addTo(map);
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [shipments, selectedShipmentId]);

  return (
    <div
      id="logistics-map"
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
