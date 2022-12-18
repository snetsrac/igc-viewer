import { FlightTrack } from '../api/api';

interface FlightTrackListProps {
  flightTracks: FlightTrack[];
  selectedFlightTrack: FlightTrack | null;
  onSelectFlightTrack: (selectedFlightTrack: FlightTrack) => void;
}

export default function FlightTrackList({
  flightTracks,
  selectedFlightTrack,
  onSelectFlightTrack,
}: FlightTrackListProps) {
  return (
    <div className='scrollbar-hidden flex w-96 flex-shrink-0 flex-col overflow-y-auto bg-gray-700'>
      <div>
        {flightTracks.map((flightTrack, i) => (
          <button
            key={i}
            className={
              'flex h-36 w-full items-center justify-between border-b border-gray-800 px-8 text-white hover:bg-gray-500' +
              (flightTrack === selectedFlightTrack ? ' bg-gray-600' : '')
            }
            onClick={() => onSelectFlightTrack(flightTrack)}
          >
            <div className='flex flex-col text-left'>
              <span className='font-bold'>{flightTrack.properties.date.toLocaleDateString()}</span>{' '}
              <span className='font-bold'>{flightTrack.properties.airport}</span>
              <span>
                {flightTrack.properties.pilot} ({flightTrack.properties.contest_number})
              </span>
              <span>{flightTrack.properties.glider}</span>
            </div>
            <div className={flightTrack === selectedFlightTrack ? 'font-extrabold' : ''}>&gt;</div>
          </button>
        ))}
      </div>
    </div>
  );
}
