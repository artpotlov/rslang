import { Chart, registerables } from 'chart.js';
import { TChartData } from '../../types/types';

const initChart = (ctx: HTMLCanvasElement, { data, labels, title }: TChartData) => {
  Chart.register(...registerables);
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          fill: false,
          borderColor: 'rgb(99, 102, 241)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: 0,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
  return chart;
};

export default initChart;
