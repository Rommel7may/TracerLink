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

// 🎨 Color palette for further studies
const COLORS: Record<string, string> = {
  yes: 'hsl(158, 75%, 40%)',      // vibrant green
  no: 'hsl(0, 65%, 50%)',         // bright red
  unknown: 'hsl(210, 15%, 55%)',  // medium gray-blue
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

        // Group and combine duplicate entries
        const groupedData: Record<string, number> = {};
        
        res.data.forEach((item: any) => {
          const key = item.name?.toLowerCase().trim();
          if (key) {
            groupedData[key] = (groupedData[key] || 0) + item.value;
          }
        });

        // Map to formatted data
        const formatted: ChartData[] = Object.entries(groupedData).map(([key, value]) => {
          let displayName = key;
          let colorKey = key;

          if (key === 'unknown') {
            displayName = 'Not tracked';
            colorKey = 'unknown';
          } else if (key === 'yes' || key === 'no') {
            displayName = key.charAt(0).toUpperCase() + key.slice(1);
          }

          return {
            name: displayName,
            value: value,
            fill: COLORS[colorKey] ?? COLORS.unknown,
          };
        });

        setData(formatted);
      } catch (error) {
        console.error('Error loading pursuing studies chart:', error);
      }
    };

    fetchData();
  }, [programId, year]);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="mt-4 px-2">
        <div className="grid grid-cols-1 gap-2">
          {payload.map((entry: any, index: number) => {
            const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : '0';
            const isMaxValue = entry.payload.value === maxValue;
            
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
                    {entry.payload.value.toLocaleString()}
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

  // Custom label function to hide 0% labels
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }: any) => {
    if (percent === 0) return null; // Hide label if percentage is 0

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="h-full w-full rounded-xl border bg-background text-foreground shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Further Studies</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Are alumni currently pursuing further studies?
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No further studies data available
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    stroke='none'
                    label={renderCustomizedLabel}
                    labelLine={false}
                    isAnimationActive={true}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.fill}
                        stroke={entry.value === maxValue ? '#fff' : undefined}
                        strokeWidth={entry.value === maxValue ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      [`${value}`, 'Alumni']
                    }
                    contentStyle={{
                      backgroundColor: 'white',
                      color: '#111827',
                      fontSize: 13,
                      borderRadius: 6,
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelFormatter={(name) => `Response: ${name}`}
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
                  Response Breakdown
                </h4>
                {renderLegend({ payload: data.map((item, index) => ({
                  value: item.name,
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