'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  Cell,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

type ChartItem = {
  year: string;
  total: number;
  percent?: string;
};

type Props = {
  programId: string;
  year?: string;
};

const GRADIENT_ID = 'gradProgram';
const BAR_COLORS = ['#6366f1', '#818cf8']; // Indigo

export default function TotalGraduatesChart({ programId, year }: Props) {
  const [data, setData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/chart/total-graduates', {
          params: { program_id: programId, year },
        });

        const raw = res.data;
        const totalAll = raw.reduce((sum: number, item: ChartItem) => sum + item.total, 0);

        const processed = raw
          .map((item: ChartItem) => ({
            ...item,
            percent: totalAll > 0 ? ((item.total / totalAll) * 100).toFixed(1) + '%' : '0%',
          }))
          .sort((a: ChartItem, b: ChartItem) => b.year.localeCompare(a.year));

        setData(processed);
      } catch (err) {
        console.error('Failed to fetch graduate chart data:', err);
      }
    };

    fetchData();
  }, [programId, year]);

  return (
    <Card className="w-full h-full rounded-2xl border shadow-sm bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Total Graduates</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Number of alumni graduates by year
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, data.length * 45)}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 80, bottom: 10, left: 30 }}
            >
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={BAR_COLORS[0]} />
                  <stop offset="100%" stopColor={BAR_COLORS[1]} />
                </linearGradient>
              </defs>

              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis
                type="category"
                dataKey="year"
                tick={{ fontSize: 12, fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />

              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  const percent = props.payload.percent;
                  return [`${value} (${percent})`, 'Graduates'];
                }}
                labelStyle={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  borderColor: '#e5e7eb',
                  color: '#111827',
                }}
              />

              <Bar dataKey="total" fill={`url(#${GRADIENT_ID})`} radius={[4, 4, 4, 4]}>
                <LabelList dataKey="percent" position="right" fill="currentColor" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trend data <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Filtered by selected program and year
        </div>
      </CardFooter>
    </Card>
  );
}
