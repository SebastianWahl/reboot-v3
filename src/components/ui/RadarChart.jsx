import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Props: labels (array of 4 strings), values (array of 4 numbers 0-10)
export default function RadarChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Profil cognitif',
        data: values,
        backgroundColor: 'rgba(224, 123, 57, 0.2)',
        borderColor: '#e07b39',
        borderWidth: 2,
        pointBackgroundColor: '#e07b39',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#e07b39',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, color: '#2d1a0e' },
        grid: { color: 'rgba(224, 123, 57, 0.2)' },
        angleLines: { color: 'rgba(224, 123, 57, 0.3)' },
        pointLabels: { color: '#2d1a0e', font: { size: 13 } },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Radar data={data} options={options} />;
}
