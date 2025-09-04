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
  'not tracked': '#be185d', // pink-700
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
          browser: item.browser === 'unknown' ? 'Not tracked' : item.browser,
          visitors: item.visitors,
          fill: COLORS[item.browser?.toLowerCase() as keyof typeof COLORS] ?? COLORS['not tracked'],
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
      <div className="mt-4 px-2">
        <div className="grid grid-cols-1 gap-3">
          {payload.map((entry: any, index: number) => {
            const percent = ((entry.payload.visitors / total) * 100).toFixed(1);
            const isMaxValue = entry.payload.visitors === maxValue;
            
            return (
              <div 
                key={`legend-${index}`} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isMaxValue ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {entry.value}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {entry.payload.visitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {total > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Responses</span>
              <span className="text-sm font-bold text-gray-900">{total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full w-full rounded-xl border bg-background text-foreground shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Work Location Distribution</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Geographic distribution of alumni employment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No location data available
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="visitors"
                    nameKey="browser"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    stroke='none'
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    isAnimationActive
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke={entry.visitors === maxValue ? '#fff' : undefined}
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
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelFormatter={(name) => `Location: ${name}`}
                    labelStyle={{ 
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                  Location Breakdown
                </h4>
                {renderLegend({ payload: data.map((item, index) => ({
                  value: item.browser,
                  color: item.fill,
                  payload: item
                })) })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}