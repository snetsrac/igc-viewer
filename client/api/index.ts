import { Feature, LineString } from '@turf/helpers';
import { useEffect, useState } from 'react';

export interface FlightTrack extends Feature {
  id: number;
  geometry: LineString;
  properties: {
    date: Date;
    pilot: string;
    glider: string;
    contest_number: string;
    airport: string;
    b_record_times: Date[];
  };
  type: 'Feature';
}

export function useFlightTracks() {
  const [flightTracks, setFlightTracks] = useState<FlightTrack[]>([]);

  useEffect(() => {
    fetch('/api/flight-tracks')
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
                b_record_times: value.properties.b_record_times.map(timeValue => new Date(timeValue))
              },
            }))
          );
        }
      });
  }, []);

  return flightTracks;
}
