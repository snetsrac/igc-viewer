import bbox from '@turf/bbox';
import bearing from '@turf/bearing';
import { Point } from '@turf/helpers';
import nearestPointOnLine, { NearestPointOnLine } from '@turf/nearest-point-on-line';
import { Feature } from 'geojson';
import { useEffect, useState } from 'react';
import Map, { Layer, LngLatBoundsLike, Marker, Source, useMap } from 'react-map-gl';
import { FlightTrack } from '../api';

interface MapViewerProps {
  selectedFlightTrack: FlightTrack | null;
  trackSegmentIndex: number;
  onUpdateNearestPoint: (trackSegmentIndex: number) => void;
}

const minUpdateIntervalMs = 0.02 * 1000;
let time = new Date().getTime();

export default function MapViewer({ selectedFlightTrack, trackSegmentIndex, onUpdateNearestPoint }: MapViewerProps) {
  const [nearestPoint, setNearestPoint] = useState<NearestPointOnLine | Feature<Point> | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const { igcMap } = useMap();

  const updateNearestPoint = (event: any) => {
    if (new Date().getTime() - time > minUpdateIntervalMs && selectedFlightTrack != null) {
      const newNearestPoint = nearestPointOnLine(selectedFlightTrack, event.lngLat.wrap().toArray());
      setNearestPoint(newNearestPoint);
      onUpdateNearestPoint(newNearestPoint.properties.index ?? 0);
      time = new Date().getTime();

      if (newNearestPoint.properties.index) {
        const start = selectedFlightTrack.geometry.coordinates[newNearestPoint.properties.index];
        const end = selectedFlightTrack.geometry.coordinates[newNearestPoint.properties.index + 1];
        setRotation(bearing(start, end));
      }
    }
  };

  // Pan and zoom view when a new flight track is selected
  useEffect(() => {
    if (selectedFlightTrack == null) return;
    const box = bbox(selectedFlightTrack.geometry) as LngLatBoundsLike;
    igcMap?.fitBounds(box, { padding: 40 });
  }, [selectedFlightTrack, igcMap]);

  // Update glider map marker position on mouse move
  useEffect(() => {
    igcMap?.on('mousemove', updateNearestPoint);

    return () => {
      igcMap?.off('mousemove', updateNearestPoint);
    };
  }, [igcMap, updateNearestPoint]);

  // Update glider map marker position on prop change
  useEffect(() => {
    if (selectedFlightTrack == null) return;

    if (trackSegmentIndex === selectedFlightTrack.geometry.coordinates.length) {
      trackSegmentIndex--;
    }

    const start = selectedFlightTrack.geometry.coordinates[trackSegmentIndex];
    const end = selectedFlightTrack.geometry.coordinates[trackSegmentIndex + 1];
    setRotation(bearing(start, end));

    setNearestPoint({ geometry: { coordinates: [start[0], start[1]], type: 'Point' } } as Feature<Point>);
  }, [trackSegmentIndex]);

  // Load glider map marker image
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
          style={{ width: '96px' }}
        >
          <img src='/glider_top.png' />
        </Marker>
      )}
    </Map>
  );
}
