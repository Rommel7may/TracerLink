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

// 🎨 Color palette for course relevance (warm hues)
const COLORS: Record<string, string> = {
  yes: '#facc15',     // yellow-400
  no: '#f97316',      // orange-500
  unsure: '#ea580c',  // orange-600
  unknown: '#78350f', // deep orange-900
};

export default function RelatedChart({ programId, year }: Props) {
  const [data, setData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: Record<string, string> = {};
        if (programId) params.programId = programId;
        if (year) params.year = year;

        const res = await axios.get('/related', { params });

        const incoming: ChartItem[] = res.data.map((item: any) => ({
          browser: item.browser,
          visitors: item.visitors,
          fill:
            COLORS[item.browser?.toLowerCase() as keyof typeof COLORS] ??
            COLORS.unknown,
        }));

        setData(incoming);
      } catch (err) {
        console.error('Error fetching related chart:', err);
      }
    };

    fetchData();
  }, [programId, year]);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 capitalize text-muted-foreground dark:text-slate-300">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="h-full w-full rounded-2xl border bg-background text-foreground shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Course Relevance
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Are alumni working in jobs related to their degree?
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[300px] flex items-center justify-center">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="visitors"
                nameKey="browser"
                cx="50%"
                cy="50%"
                innerRadius={60} // 🎯 donut effect
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`
                }
                isAnimationActive
                className="capitalize"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  color: '#1f2937',
                  borderRadius: 8,
                  stroke: 'none',
                  fontSize: 13,
                  border: '1px solid #e5e7eb',
                }}
                wrapperStyle={{ color: '#1f2937' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend content={renderLegend} verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
