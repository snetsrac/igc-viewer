import { Chart, LinearScale, TimeScale, PointElement, LineElement, Tooltip, ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FlightTrack } from '../api';

interface AltitudeChartProps {
  selectedFlightTrack: FlightTrack | null;
  mapSegmentIndex: number;
  onUpdateTooltip: (index: number) => void;
}

Chart.register(LinearScale, TimeScale, PointElement, LineElement, Tooltip);

export default function AltitudeChart({ selectedFlightTrack, mapSegmentIndex, onUpdateTooltip }: AltitudeChartProps) {
  const [isSelfUpdate, setIsSelfUpdate] = useState(false);
  const ref = useRef<Chart>();
  const chart = ref.current;

  useEffect(() => {
    if (isSelfUpdate) {
      setIsSelfUpdate(false);
    }

    if (chart && chart.tooltip) {
      chart.tooltip.setActiveElements(
        [
          {
            datasetIndex: 0,
            index: mapSegmentIndex,
          },
        ],
        { x: 0, y: 0 }
      );
    }
  }, [mapSegmentIndex]);

  if (selectedFlightTrack == null) return <></>;

  const data = {
    datasets: [
      {
        data: selectedFlightTrack.geometry.coordinates.map((position) => position[2]),
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 3,
        backgroundColor: 'rgb(255, 0, 0, 1)',
      },
    ],
    labels: selectedFlightTrack.properties.b_record_times,
  };

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
    onHover: (event) => {
      if (event.type === 'mousemove' && !isSelfUpdate) {
        setIsSelfUpdate(true);
      }
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
          // Update track segment
          if (isSelfUpdate) {
            onUpdateTooltip(context.tooltip.dataPoints[0].dataIndex);
          }

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
        ticks: { stepSize: 5 },
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

  return <Line ref={ref} data={data} options={options} height={1} width={1} />;
}
