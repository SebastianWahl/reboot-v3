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

// Props: labels (array of 4 strings), values (array of 4 numbers 0-25), variant ('scientific' | 'futuristic')
export default function RadarChart({ labels, values, variant = 'scientific' }) {
  const isFuturistic = variant === 'futuristic';
  
  // Colors based on variant
  const colors = isFuturistic ? {
    fill: 'rgba(0, 245, 255, 0.15)',
    stroke: '#00f5ff',
    point: '#00f5ff',
    grid: 'rgba(255, 255, 255, 0.1)',
    angleLines: 'rgba(255, 255, 255, 0.15)',
    labels: 'rgba(255, 255, 255, 0.8)',
    ticks: 'rgba(255, 255, 255, 0.5)',
  } : {
    fill: 'rgba(224, 123, 57, 0.2)',
    stroke: '#e07b39',
    point: '#e07b39',
    grid: 'rgba(224, 123, 57, 0.2)',
    angleLines: 'rgba(224, 123, 57, 0.3)',
    labels: '#2d1a0e',
    ticks: '#2d1a0e',
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Profil cognitif',
        data: values,
        backgroundColor: colors.fill,
        borderColor: colors.stroke,
        borderWidth: isFuturistic ? 3 : 2,
        pointBackgroundColor: colors.point,
        pointBorderColor: isFuturistic ? '#00f5ff' : '#fff',
        pointHoverBackgroundColor: isFuturistic ? '#fff' : '#fff',
        pointHoverBorderColor: colors.point,
        pointRadius: isFuturistic ? 5 : 4,
        pointHoverRadius: isFuturistic ? 7 : 6,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 25,
        ticks: { 
          stepSize: 5, 
          color: colors.ticks,
          font: { size: 10 }
        },
        grid: { 
          color: colors.grid,
          lineWidth: 1
        },
        angleLines: { 
          color: colors.angleLines,
          lineWidth: 1
        },
        pointLabels: { 
          color: colors.labels, 
          font: { 
            size: 12,
            family: isFuturistic ? "'Orbitron', sans-serif" : "'Inter', sans-serif"
          } 
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
    layout: {
      padding: { top: -20, bottom: -30, left: 0, right: 0 },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Radar data={data} options={options} />
    </div>
  );
}
