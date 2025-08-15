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

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

type Props = {
  programId?: string;
  year?: string;
};

// 🎨 Light/Dark mode-safe color palette
const COLORS: Record<string, string> = {
  yes: '#22c55e',     // green-500
  no: '#ef4444',      // red-500
  unknown: '#9ca3af', // gray-400
};

export default function PursuingStudiesChart({ programId, year }: Props) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: Record<string, string> = {};
        if (programId) params.program_id = programId;
        if (year) params.year = year;

        const res = await axios.get('/chart/pursuing-studies', { params });

        const filtered = res.data.filter((item: any) =>
          ['yes', 'no'].includes(item.name?.toLowerCase())
        );

        const formatted: ChartData[] = filtered.map((item: any) => ({
          name: item.name,
          value: item.value,
          fill: COLORS[item.name?.toLowerCase()] ?? COLORS.unknown,
        }));

        setData(formatted);
      } catch (error) {
        console.error('Error loading pursuing studies chart:', error);
      }
    };

    fetchData();
  }, [programId, year]);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value));

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="mt-3 flex flex-col items-center gap-y-1 text-sm text-muted-foreground dark:text-slate-300">
        {payload.map((entry: any, index: number) => {
          const percent = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <li key={index} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">
                {entry.value} {entry.value === maxValue && '🔥'} ({percent}%)
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
        <CardTitle className="text-lg font-semibold tracking-tight">
          Pursuing Further Studies?
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {total > 0
            ? `Total responses: ${total}`
            : 'Are alumni currently pursuing further studies?'}
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
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60} // 🎯 Donut style
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
                isAnimationActive
                className="capitalize"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.fill}
                    stroke={
                      entry.value === maxValue ? '#1e293b' : 'transparent'
                    }
                    strokeWidth={entry.value === maxValue ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  [`${value}`, 'Responses']
                }
                contentStyle={{
                  backgroundColor: 'white',
                  color: '#111827',
                  fontSize: 13,
                  borderRadius: 6,
                  borderColor: '#e5e7eb',
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                content={renderLegend}
                verticalAlign="bottom"
                height={40}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
