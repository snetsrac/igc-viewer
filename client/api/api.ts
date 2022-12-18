import { Feature } from '@turf/helpers';
import { useEffect, useState } from 'react';

export interface FlightTrack extends Feature {
  properties: {
    date: Date;
    pilot: string;
    glider: string;
    contest_number: string;
    airport: string;
  };
}

export function useFlightTracks(onSetFlightTracks: () => void) {
  const [flightTracks, setFlightTracks] = useState<FlightTrack[]>([]);

  useEffect(() => {
    fetch('/api/features')
      .then<typeof flightTracks>((res) => res.json())
      .then((values) => {
        if (values == undefined) {
          setFlightTracks([]);
        } else {
          setFlightTracks(
            values.map((value) => ({
              ...value,
              properties: {
                ...value.properties,
                date: new Date(value.properties.date),
              },
            }))
          );
        }

        onSetFlightTracks();
      });
  }, []);

  return flightTracks;
}
