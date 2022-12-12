import center from '@turf/center';
import { Feature, Feature as TurfFeature } from '@turf/helpers';
import { Feature as GeojsonFeature } from 'geojson';
import { useEffect } from 'react';
import Map, { Layer, Source, useMap } from 'react-map-gl';

interface MapViewerProps {
  selectedFeature?: TurfFeature;
}

const getFlyToOptions = (feature: Feature) => {
  const position = center(feature).geometry.coordinates;

  return {
    center: {
      lon: position[0],
      lat: position[1],
    },
    zoom: 9,
  };
};

export default function MapViewer({ selectedFeature }: MapViewerProps) {
  const { igcMap } = useMap();

  useEffect(() => {
    if (selectedFeature == undefined) return;
    console.log(getFlyToOptions(selectedFeature));
    igcMap?.flyTo(getFlyToOptions(selectedFeature));
  }, [selectedFeature, igcMap]);

  return (
    <Map
      id='igcMap'
      initialViewState={{
        longitude: -111.888,
        latitude: 40.01,
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
      <Source id='feature' type='geojson' data={selectedFeature as GeojsonFeature}>
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
