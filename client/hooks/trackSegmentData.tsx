import bearing from '@turf/bearing';
import distance from '@turf/distance';
import length from '@turf/length';
import lineSlice from '@turf/line-slice';
import { formatDistanceStrict } from 'date-fns';
import { FlightTrack } from '../api';

export interface TrackSegmentData {
  time: Date;
  distanceKm: number;
  airspeedKph: number;
  altitudeM: number;
  heading: number;
}

export const updateTrackSegmentData = (
  data: TrackSegmentData,
  selectedFlightTrack: FlightTrack | null,
  trackSegmentIndex: number
) => {
  if (selectedFlightTrack == null) return;

  if (trackSegmentIndex === selectedFlightTrack.geometry.coordinates.length - 1) {
    trackSegmentIndex--;
  }

  const start = selectedFlightTrack.geometry.coordinates[trackSegmentIndex];
  const end = selectedFlightTrack.geometry.coordinates[trackSegmentIndex + 1];

  const time = selectedFlightTrack.properties.b_record_times[trackSegmentIndex];

  const distanceKm = length(
    lineSlice(selectedFlightTrack.geometry.coordinates[0], start, selectedFlightTrack.geometry)
  );

  const startTime = selectedFlightTrack.properties.b_record_times[trackSegmentIndex];
  const endTime = selectedFlightTrack.properties.b_record_times[trackSegmentIndex + 1];
  const durationHr = Number(formatDistanceStrict(endTime, startTime, { unit: 'second' }).split(' ')[0]) / 60 / 60;
  const airspeedKph = distance(start, end) / durationHr;

  const altitudeM = start[2];

  const heading = (bearing(start, end) + 360) % 360;

  data.time = time;
  data.distanceKm = distanceKm;
  data.airspeedKph = airspeedKph;
  data.altitudeM = altitudeM;
  data.heading = heading;
};
