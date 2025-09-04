'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  employed: { 
    label: 'Employed', 
    color: 'hsl(152, 76%, 40%)'   // emerald-500 (#10b981)
  },
  unemployed: { 
    label: 'Unemployed', 
    color: 'hsl(0, 84%, 60%)'     // red-500 (#ef4444)
  },
  nottracked: { 
    label: 'Not Tracked', 
    color: 'hsl(220, 9%, 46%)'    // gray-500 (#6b7280)
  },
} satisfies Record<string, { label: string; color: string }>;

export function ChartPieLegend({ programId, year }: Props) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const params: Record<string, string> = {};
        if (programId) params.program_id = programId;
        if (year) params.year = year;

        const response = await axios.get('/alumni-chart', { params });

        const dataWithColors = response.data.map((item: ChartDataItem) => {
          const key = item.browser.toLowerCase().replace(/\s+/g, ''); // normalize casing and remove spaces
          type ChartConfigKey = keyof typeof chartConfig;
          const isChartConfigKey = (k: string): k is ChartConfigKey =>
            k === 'employed' || k === 'unemployed' || k === 'nottracked';
          return {
            ...item,
            browser: item.browser === 'unknown' ? 'Not Tracked' : item.browser,
            fill: isChartConfigKey(key) ? chartConfig[key].color : '#d1d5db',
          };
        });

        setChartData(dataWithColors);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [programId, year]);

  const total = chartData.reduce((sum, d) => sum + d.visitors, 0);
  const maxValue = Math.max(...chartData.map((d) => d.visitors), 0);

  // Enhanced legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="mt-4 px-2">
        <div className="grid grid-cols-1 gap-2">
          {payload.map((entry: any, index: number) => {
            const percent = total > 0 ? ((entry.payload.visitors / total) * 100).toFixed(1) : '0';
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
        <CardTitle className="text-lg font-semibold">Employment Status</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Distribution of alumni employment status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No employment data available
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="visitors"
                    nameKey="browser"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    stroke='none'
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    isAnimationActive
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill || '#d1d5db'}
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
                    labelFormatter={(name) => `Status: ${name}`}
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
                  Status Breakdown
                </h4>
                {renderLegend({ payload: chartData.map((item, index) => ({
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