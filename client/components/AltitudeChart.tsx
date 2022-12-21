import { Chart, LinearScale, TimeScale, PointElement, LineElement, Tooltip, ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { FlightTrack } from '../api';

interface AltitudeChartProps {
  selectedFlightTrack: FlightTrack | null;
}

Chart.register(LinearScale, TimeScale, PointElement, LineElement, Tooltip);

const options = {
  animation: false,
  elements: {
    line: {
      borderJoinStyle: 'bevel',
    },
    point: {
      pointStyle: false,
    },
  },
  interaction: {
    mode: 'x',
    intersect: false,
  },
  layout: {
    padding: {
      top: 24,
      bottom: 10,
      left: 10,
      right: 30,
    },
  },
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: false,
      external: (context) => {
        // Tooltip element
        let tooltip = document.getElementById('chartjs-tooltip');

        // Create element on first render
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.id = 'chartjs-tooltip';
          tooltip.innerHTML = '<img src="/glider_side.png" />';
          tooltip.style.pointerEvents = 'none';
          tooltip.style.position = 'absolute';
          tooltip.style.width = '48px';
          document.body.appendChild(tooltip);
        }

        // Set display, position, and style
        const position = context.chart.canvas.getBoundingClientRect();
        tooltip.style.left = position.left + context.tooltip.caretX - tooltip.clientWidth / 2 + 'px';
        tooltip.style.top = position.top + context.tooltip.caretY - tooltip.clientHeight / 2 + 'px';
        tooltip.style.opacity = '1';
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        displayFormats: {
          minute: 'HH:mm',
        },
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Altitude (m)',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  },
} as ChartOptions<'line'>;

const transformData = (flightTrack: FlightTrack): ChartData<'line'> => {
  return {
    datasets: [
      {
        data: flightTrack.geometry.coordinates.map((position) => position[2]),
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 3,
        backgroundColor: 'rgb(255, 0, 0, 1)',
      },
    ],
    labels: flightTrack.properties.b_record_times,
  };
};

export default function AltitudeChart({ selectedFlightTrack }: AltitudeChartProps) {
  if (selectedFlightTrack == null) return <></>;

  const data = transformData(selectedFlightTrack);

  return <Line data={data} options={options} height={1} width={1} />;
}
