import Head from 'next/head';
import { useEffect, useState } from 'react';
import MapViewer from '../components/MapViewer';
import { MapProvider } from 'react-map-gl';
import Header from '../components/Header';
import FlightTrackList from '../components/FlightTrackList';
import { FlightTrack, useFlightTracks } from '../api/api';
import { NearestPointOnLine } from '@turf/nearest-point-on-line';

export default function Home() {
  const [selectedFlightTrack, setSelectedFlightTrack] = useState<FlightTrack | null>(null);
  const [nearestPoint, setNearestPoint] = useState<NearestPointOnLine | null>(null);
  const flightTracks = useFlightTracks();

  useEffect(() => {
    flightTracks.length > 0 ? setSelectedFlightTrack(flightTracks[0]) : setSelectedFlightTrack(null);
  }, [flightTracks]);

  const onSelectFlightTrack = (flightTrack: FlightTrack) => {
    setSelectedFlightTrack(flightTrack);
  };

  return (
    <>
      <Head>
        <title>IGC Viewer</title>
        <meta
          name='description'
          content='Web map application for viewing .igc files generated by glider flight trackers'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='flex h-screen flex-col'>
        <Header />
        <main className='flex flex-grow overflow-hidden bg-gray-50'>
          <FlightTrackList
            flightTracks={flightTracks}
            selectedFlightTrack={selectedFlightTrack}
            onSelectFlightTrack={onSelectFlightTrack}
          />
          <MapProvider>
            <MapViewer selectedFlightTrack={selectedFlightTrack} />
          </MapProvider>
        </main>
      </div>
    </>
  );
}
