
import type { ChartConfig } from '@/components/ui/chart';

export const chartData = [
  { month: 'January', revenue: 18600, quotes: 80 },
  { month: 'February', revenue: 20500, quotes: 95 },
  { month: 'March', revenue: 23700, quotes: 110 },
  { month: 'April', revenue: 15600, quotes: 85 },
  { month: 'May', revenue: 28900, quotes: 140 },
  { month: 'June', revenue: 32400, quotes: 155 },
];

export const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  quotes: {
    label: 'Quotes',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const totalRevenue = 139100;
export const revenueGrowth = 18.3;

