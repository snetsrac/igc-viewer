import Map, { Source } from 'react-map-gl';

export default function MapViewer() {
  return (
    <Map
      initialViewState={{
        longitude: -77.866,
        latitude: 37.316,
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
    </Map>
  );
}
