import { format } from 'date-fns';
import { TrackSegmentData } from '../hooks/trackSegmentData';

interface HeaderProps {
  data: TrackSegmentData | null;
}

export default function Header({ data }: HeaderProps) {
  return (
    <header>
      <nav className='bg-gray-800 px-2 text-white sm:px-4 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex w-full items-center gap-8 whitespace-pre'>
            <span className='text-3xl font-bold tracking-wider'>IGC Viewer</span>
            {data && (
              <>
                <span className='ml-auto'>
                  <b>Time</b>: <code>{format(data.time, 'HH:mm:ss')}</code>
                </span>
                <span>
                  <b>Dist</b>: <code>{data.distanceKm.toFixed(2).padStart(6, ' ')}</code> km
                </span>
                <span>
                  <b>Spd</b>: <code>{data.airspeedKph.toFixed(1).padStart(5, ' ')}</code> kph
                </span>
                <span>
                  <b>Alt</b>: <code>{data.altitudeM.toFixed().padStart(5, ' ')}</code> m
                </span>
                <span>
                  <b>Hdg</b>: <code>{data.heading.toFixed().padStart(3, '0')}</code>°
                </span>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
