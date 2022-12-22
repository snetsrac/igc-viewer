import Head from 'next/head';
import { useEffect, useState } from 'react';
import MapViewer from '../components/MapViewer';
import { MapProvider } from 'react-map-gl';
import Header from '../components/Header';
import FlightTrackList from '../components/FlightTrackList';
import { FlightTrack, useFlightTracks } from '../api';
import AltitudeChart from '../components/AltitudeChart';
import { TrackSegmentData, updateTrackSegmentData } from '../hooks/trackSegmentData';

export default function Home() {
  const flightTracks = useFlightTracks();
  const [selectedFlightTrack, setSelectedFlightTrack] = useState<FlightTrack | null>(null);
  const [trackSegmentIndex, setTrackSegmentIndex] = useState(0);
  const [trackSegmentData] = useState<TrackSegmentData>({
    time: new Date(),
    distanceKm: 0,
    airspeedKph: 0,
    altitudeM: 0,
    heading: 0,
  });

  useEffect(() => {
    if (flightTracks.length > 0) {
      setSelectedFlightTrack(flightTracks[0]);
    } else {
      setSelectedFlightTrack(null);
    }
  }, [flightTracks]);

  useEffect(() => {
    updateTrackSegmentData(trackSegmentData, selectedFlightTrack, trackSegmentIndex);
  }, [selectedFlightTrack, trackSegmentIndex]);

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
        <Header data={selectedFlightTrack && trackSegmentData} />
        <main className='flex flex-grow overflow-hidden bg-gray-50'>
          <FlightTrackList
            flightTracks={flightTracks}
            selectedFlightTrack={selectedFlightTrack}
            onSelectFlightTrack={onSelectFlightTrack}
          />
          <div className='flex flex-grow flex-col'>
            <MapProvider>
              <MapViewer
                selectedFlightTrack={selectedFlightTrack}
                trackSegmentIndex={trackSegmentIndex}
                onUpdateNearestPoint={(trackSegmentIndex) => setTrackSegmentIndex(trackSegmentIndex)}
              />
            </MapProvider>
            <div className='max-w-96 h-96' style={{ height: 360 }}>
              <AltitudeChart
                selectedFlightTrack={selectedFlightTrack}
                trackSegmentIndex={trackSegmentIndex}
                onUpdateTooltip={(trackSegmentIndex) => setTrackSegmentIndex(trackSegmentIndex)}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
