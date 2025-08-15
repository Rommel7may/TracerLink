'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ChartItem = {
  browser: string;
  visitors: number;
  fill: string;
};

type Props = {
  programId?: string;
  year?: string;
};

const COLORS: Record<string, string> = {
  local: '#f472b6',   // pink-400
  abroad: '#ec4899',  // pink-500
  unknown: '#be185d', // pink-700
};

export default function LocationPieChart({ programId, year }: Props) {
  const [data, setData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/location', {
          params: {
            programId,
            year,
          },
        });

        const incoming: ChartItem[] = res.data.map((item: any) => ({
          browser: item.browser,
          visitors: item.visitors,
          fill: COLORS[item.browser?.toLowerCase() as keyof typeof COLORS] ?? COLORS.unknown,
        }));

        setData(incoming);
      } catch (err) {
        console.error('Error fetching location chart:', err);
      }
    };

    fetchData();
  }, [programId, year]);

  const total = data.reduce((sum, d) => sum + d.visitors, 0);
  const maxValue = Math.max(...data.map((d) => d.visitors));

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="mt-2 flex flex-col items-center justify-center gap-y-1 text-sm text-muted-foreground dark:text-slate-300">
        {payload.map((entry: any, index: number) => {
          const percent = ((entry.payload.visitors / total) * 100).toFixed(1);
          return (
            <li key={`legend-${index}`} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">
                {entry.value} {entry.payload.visitors === maxValue && '🔥'} ({percent}%)
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card className="h-full w-full rounded-2xl border bg-background text-foreground shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Work Location</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Where are the alumni currently working?
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="visitors"
                nameKey="browser"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
                isAnimationActive
                className="capitalize"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.visitors === maxValue ? '#1e293b' : undefined}
                    strokeWidth={entry.visitors === maxValue ? 2 : 0}
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
                wrapperStyle={{ color: 'black' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend content={renderLegend} verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
