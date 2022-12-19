import center from '@turf/center';
import nearestPointOnLine, { NearestPointOnLine } from '@turf/nearest-point-on-line';
import { Feature } from 'geojson';
import { useEffect } from 'react';
import Map, { Layer, Source, useMap } from 'react-map-gl';
import { FlightTrack } from '../api/api';

interface MapViewerProps {
  selectedFlightTrack: FlightTrack | null;
}

const getFlyToOptions = (flightTrack: FlightTrack) => {
  const position = center(flightTrack).geometry.coordinates;

  return {
    center: {
      lon: position[0],
      lat: position[1],
    },
    zoom: 9,
  };
};

export default function MapViewer({ selectedFlightTrack }: MapViewerProps) {
  const { igcMap } = useMap();

  useEffect(() => {
    if (selectedFlightTrack == null) return;
    igcMap?.flyTo(getFlyToOptions(selectedFlightTrack));
  }, [selectedFlightTrack, igcMap]);

  return (
    <Map
      id='igcMap'
      initialViewState={{
        longitude: -81.848,
        latitude: 28.384,
        zoom: 9,
      }}
      mapStyle='mapbox://styles/mapbox/satellite-streets-v12'
      terrain={{ source: 'mapbox-dem' }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      maxPitch={85}
    >
      <Source
        id='mapbox-dem'
        type='raster-dem'
        url='mapbox://mapbox.mapbox-terrain-dem-v1'
        tileSize={512}
        maxzoom={14}
      />
      <Source id='selectedFlightTrack' type='geojson' data={selectedFlightTrack as unknown as Feature}>
        <Layer
          type='line'
          paint={{
            'line-color': 'red',
            'line-width': 3,
          }}
        />
      </Source>
    </Map>
  );
}
