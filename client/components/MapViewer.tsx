import bearing from '@turf/bearing';
import center from '@turf/center';
import nearestPointOnLine, { NearestPointOnLine } from '@turf/nearest-point-on-line';
import { Feature } from 'geojson';
import { useEffect, useState } from 'react';
import Map, { Layer, Marker, Source, useMap } from 'react-map-gl';
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

const minUpdateIntervalMs = 0.02 * 1000;
let time = new Date().getTime();

export default function MapViewer({ selectedFlightTrack }: MapViewerProps) {
  const [nearestPoint, setNearestPoint] = useState<NearestPointOnLine | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const { igcMap } = useMap();

  const updateNearestPoint = (event: any) => {
    if (new Date().getTime() - time > minUpdateIntervalMs && selectedFlightTrack != null) {
      const updatedNearestPoint = nearestPointOnLine(selectedFlightTrack, event.lngLat.wrap().toArray());
      setNearestPoint(updatedNearestPoint);
      time = new Date().getTime();

      if (updatedNearestPoint.properties.index) {
        const start = selectedFlightTrack.geometry.coordinates[updatedNearestPoint.properties.index];
        const end = selectedFlightTrack.geometry.coordinates[updatedNearestPoint.properties.index + 1];
        setRotation(bearing(start, end));
      }
    }
  };

  useEffect(() => {
    if (selectedFlightTrack == null) return;
    igcMap?.flyTo(getFlyToOptions(selectedFlightTrack));
    igcMap?.on('mousemove', updateNearestPoint);

    return () => {
      igcMap?.off('mousemove', updateNearestPoint);
    };
  }, [selectedFlightTrack, igcMap]);

  useEffect(() => {
    if (igcMap?.hasImage('glider')) return;

    igcMap?.loadImage('/glider_top.png', (error, image) => {
      if (error) console.log(error);
      if (image) igcMap.addImage('glider', image);
    });
  }, [igcMap]);

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
      {nearestPoint && (
        <Marker
          longitude={nearestPoint.geometry.coordinates[0]}
          latitude={nearestPoint.geometry.coordinates[1]}
          pitchAlignment='map'
          rotation={rotation}
          rotationAlignment='map'
          style={{ width: '128px' }}
        >
          <img src='/glider_top.png' />
        </Marker>
      )}
    </Map>
  );
}
