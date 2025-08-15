'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

type ChartDataItem = {
  browser: string;
  visitors: number;
  fill?: string;
};

type Props = {
  programId?: string;
  year?: string;
};

const chartConfig = {
  employed: { label: 'Employed', color: '#fb7185' },          // rose-400
  'under-employed': { label: 'Under-Employed', color: '#f43f5e' }, // rose-500
  unemployed: { label: 'Unemployed', color: '#e11d48' },       // rose-600
  'self-employed': { label: 'Self-Employed', color: '#be123c' },   // rose-700
  'currently-looking': { label: 'Currently Looking', color: '#9f1239' }, // rose-800
} satisfies ChartConfig;

export function ChartPieLegend({ programId, year }: Props) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const params: Record<string, string> = {};
        if (programId) params.program_id = programId;
        if (year) params.year = year;

        const response = await axios.get('/alumni-chart', { params });

        const dataWithColors = response.data.map((item: ChartDataItem) => ({
          ...item,
          fill:
            chartConfig[item.browser as keyof typeof chartConfig]?.color ??
            '#d1d5db', // gray-300 fallback
        }));

        setChartData(dataWithColors);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [programId, year]);

  const total = chartData.reduce((sum, item) => sum + item.visitors, 0);
  const max = Math.max(...chartData.map((i) => i.visitors));

  return (
    <Card className="flex h-[450px] w-full flex-col rounded-2xl border bg-background text-foreground shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">Alumni Employment</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Distribution of employment types
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full capitalize">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  innerRadius={60}
                  outerRadius={100}
                  className='stroke-none'
                  isAnimationActive
                  onAnimationEnd={() => setShowLabels(true)}
                  label={
                    showLabels
                      ? ({ name, percent }) =>
                          percent !== undefined
                            ? `${name} (${(percent * 100).toFixed(1)}%)`
                            : ''
                      : undefined
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke={
                        entry.visitors === max ? '#1f2937' : undefined
                      }
                      strokeWidth={entry.visitors === max ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}`, 'Alumni']}
                  contentStyle={{
                    backgroundColor: 'white',
                    color: '#111827',
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <ChartLegend
                  content={
                    <ChartLegendContent
                      nameKey="browser"
                      payload={chartData.map((item) => ({
                        name: item.browser,
                        value: `${item.visitors} ${
                          item.visitors === max ? '🔥' : ''
                        }`,
                        color: item.fill,
                      }))}
                    />
                  }
                  className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1 text-muted-foreground dark:text-slate-300 text-sm"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data available...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
