import type { ReactNode } from 'react';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import { useUiStore } from '@/store/ui';
import { accentColor, mutedColor } from '@/lib/utils';
import { Card } from '@/components/ui/card';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
);

const font = (): string => getComputedStyle(document.documentElement).getPropertyValue('--ff').trim() || 'sans-serif';

const tooltipStyle = () => ({
  backgroundColor: 'rgba(10,15,30,.95)',
  borderColor: '#2b9cf255',
  borderWidth: 1,
  titleColor: '#eaf0ff',
  bodyColor: '#c7d3ec',
  padding: 10,
  cornerRadius: 8,
  displayColors: false,
  titleFont: { family: font(), size: 12, weight: 600 as const },
  bodyFont: { family: font(), size: 12 },
});

const baseScales = (mode: string, withY2 = false) => ({
  x: {
    grid: { display: false },
    border: { display: false },
    ticks: { color: mutedColor(), font: { family: font(), size: 11 } },
  },
  y: {
    grid: { display: mode === 'day', color: 'rgba(139,151,181,.16)' },
    border: { display: false },
    ticks: { color: mutedColor(), font: { family: font(), size: 11 } },
    beginAtZero: true,
  },
  ...(withY2
    ? {
        y1: {
          position: 'right' as const,
          grid: { display: false },
          border: { display: false },
          ticks: { color: mutedColor(), font: { family: font(), size: 11 } },
          beginAtZero: true,
        },
      }
    : {}),
});

export function ChartCard({
  title,
  action,
  children,
  height = 220,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  height?: number;
}) {
  return (
    <Card title={title} action={action}>
      <div className="chart-box" style={{ height }}>
        {children}
      </div>
    </Card>
  );
}

export function HeadcountLine({ labels, data }: { labels: string[]; data: number[] }) {
  const mode = useUiStore((s) => s.mode);
  const accent = useUiStore((s) => s.accent);
  const accentHex = accentColor() || accent;

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
    scales: baseScales(mode),
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Headcount',
            data,
            borderColor: accentHex,
            borderWidth: 2.4,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: accentHex,
            pointHoverBorderColor: '#fff',
            fill: true,
            backgroundColor: (ctx: ScriptableContext<'line'>) => {
              const chart = ctx.chart;
              const { ctx: canvas, chartArea } = chart;
              if (!chartArea) return 'transparent';
              const gradient = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(43,156,242,.34)');
              gradient.addColorStop(1, 'rgba(43,156,242,0)');
              return gradient;
            },
          },
        ],
      }}
      options={options}
    />
  );
}

export function AttritionChart({
  labels,
  exits,
  risk,
}: {
  labels: string[];
  exits: number[];
  risk: number[];
}) {
  const mode = useUiStore((s) => s.mode);
  const accent = accentColor();

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
    scales: baseScales(mode, true),
  };

  const data = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Exits',
        data: exits,
        backgroundColor: 'rgba(43,156,242,.55)',
        hoverBackgroundColor: accent,
        borderRadius: 7,
        barPercentage: 0.6,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Risk score',
        data: risk,
        borderColor: '#a78bfa',
        backgroundColor: '#a78bfa',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        yAxisID: 'y1',
      },
    ],
  } as ChartData<'bar'>;

  return <Bar data={data} options={options} />;
}

export function DepartmentDoughnut({ labels, data }: { labels: string[]; data: number[] }) {
  const colors = ['#2b9cf2', '#a78bfa', '#34d399', '#fb923c', '#f472b6'];

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
  };

  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: [accentColor(), ...colors.slice(1)],
            hoverOffset: 6,
            borderWidth: 0,
          },
        ],
      }}
      options={options}
    />
  );
}

export function EngagementRadar({
  labels,
  now,
  target,
}: {
  labels: string[];
  now: number[];
  target: number[];
}) {
  const mode = useUiStore((s) => s.mode);

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
    scales: {
      r: {
        angleLines: { color: 'rgba(139,151,181,.18)' },
        grid: { color: mode === 'day' ? 'rgba(15,27,51,.1)' : 'rgba(139,151,181,.16)' },
        pointLabels: { color: mutedColor(), font: { family: font(), size: 10.5 } },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 40,
        suggestedMax: 100,
      },
    },
  };

  return (
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: 'Now',
            data: now,
            borderColor: accentColor(),
            backgroundColor: 'rgba(43,156,242,.18)',
            borderWidth: 2,
            pointRadius: 2,
          },
          {
            label: 'Target',
            data: target,
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167,139,250,.08)',
            borderWidth: 1.6,
            borderDash: [4, 4],
            pointRadius: 0,
          },
        ],
      }}
      options={options}
    />
  );
}

export function PayrollBars({ labels, gross, net }: { labels: string[]; gross: number[]; net: number[] }) {
  const mode = useUiStore((s) => s.mode);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
    scales: baseScales(mode),
  };

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: 'Gross',
            data: gross,
            backgroundColor: 'rgba(43,156,242,.75)',
            borderRadius: 6,
            barPercentage: 0.7,
          },
          {
            label: 'Net',
            data: net,
            backgroundColor: 'rgba(52,211,153,.65)',
            borderRadius: 6,
            barPercentage: 0.7,
          },
        ],
      }}
      options={options}
    />
  );
}

export function RatingBars({ labels, data }: { labels: string[]; data: number[] }) {
  const mode = useUiStore((s) => s.mode);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' },
    plugins: { legend: { display: false }, tooltip: tooltipStyle() },
    scales: baseScales(mode),
  };

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#f472b6', '#fb923c', '#facc15', '#34d399', '#2b9cf2'],
            borderRadius: 6,
            barPercentage: 0.65,
          },
        ],
      }}
      options={options}
    />
  );
}
