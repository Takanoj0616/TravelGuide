import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  markers: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title: string;
  }>;
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

export const Map: React.FC<MapProps> = ({ center, markers, zoom = 13 }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}; 