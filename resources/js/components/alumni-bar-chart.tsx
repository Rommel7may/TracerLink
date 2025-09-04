"use client"

import { TrendingUp, Users, Briefcase, UserX, Target } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Label } from "./ui/label"

type AlumniPerYear = {
  year: string
  employed: number
  unemployed: number
  total: number
}

const chartConfig = {
  total: {
    label: "Total Alumni",
    color: "#4b5563", // gray-600
  },
  employed: {
    label: "Employed",
    color: "#059669", // emerald-600
  },
  unemployed: {
    label: "Unemployed",
    color: "#dc2626", // red-600
  },
} satisfies ChartConfig

export function AlumniBarChart({ alumniPerYear }: { alumniPerYear: AlumniPerYear[] }) {
  // First, ensure all values are numbers (not strings)
  const sanitizedData = alumniPerYear.map(item => ({
    year: item.year,
    employed: typeof item.employed === 'string' ? parseInt(item.employed) || 0 : item.employed,
    unemployed: typeof item.unemployed === 'string' ? parseInt(item.unemployed) || 0 : item.unemployed,
    total: typeof item.total === 'string' ? parseInt(item.total) || 0 : item.total,
  }))

  // Calculate statistics using sanitized data
  const totalAlumni = sanitizedData.reduce((sum, year) => sum + year.total, 0)
  const totalEmployed = sanitizedData.reduce((sum, year) => sum + year.employed, 0)
  const totalUnemployed = sanitizedData.reduce((sum, year) => sum + year.unemployed, 0)
  const employmentRate = totalAlumni > 0 ? Math.round((totalEmployed / (totalEmployed + totalUnemployed)) * 100) : 0

  // Reverse data for horizontal chart (newest at top)
  const chartData = [...sanitizedData].reverse()

  // Safe number formatting function
  const formatNumber = (num: number) => {
    try {
      return num.toLocaleString()
    } catch (error) {
      return num.toString() // Fallback if toLocaleString fails
    }
  }

  return (
    <Card className="w-full rounded-xl border-0 shadow-lg bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Alumni Employment Overview</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Yearly breakdown of alumni employment status
            </CardDescription>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-gray-200">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatNumber(totalAlumni)}</div>
            <div className="text-xs font-medium text-gray-600">Total Alumni</div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-green-200">
                <Briefcase className="h-5 w-5 text-green-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatNumber(totalEmployed)}</div>
            <div className="text-xs font-medium text-green-600">Employed</div>
          </div>
          
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-red-200">
                <UserX className="h-5 w-5 text-red-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-700">{formatNumber(totalUnemployed)}</div>
            <div className="text-xs font-medium text-red-600">Unemployed</div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-blue-200">
                <Target className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{employmentRate}%</div>
            <div className="text-xs font-medium text-blue-600">Employment Rate</div>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="h-80 ">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                barCategoryGap={12}
                barGap={4}
              >
                <CartesianGrid 
                  horizontal={true} 
                  vertical={false}
                  strokeDasharray="3 3" 
                  stroke="#f3f4f6" 
                />
                
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                
                <YAxis
                  type="category"
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                  width={70}
                />

                <ChartTooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  content={
                    <ChartTooltipContent 
                      indicator="line"
                      labelFormatter={(value) => `Graduation Year: ${value}`}
                      formatter={(value, name) => {
                        const label = chartConfig[name as keyof typeof chartConfig]?.label || name;
                        return [`${formatNumber(Number(value))} alumni`, label];
                      }}
                    />
                  }
                />

                {/* Total Bar */}
                <Bar 
                  dataKey="total" 
                  fill="var(--color-total)" 
                  radius={[0, 4, 4, 0]}
                  name="total"
                >
                  <LabelList 
                    dataKey="total" 
                    position="right" 
                    style={{ 
                      fontSize: 11, 
                      fontWeight: 500,
                      fill: '#374151'
                    }} 
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>

                {/* Employed Bar */}
                <Bar 
                  dataKey="employed" 
                  fill="var(--color-employed)" 
                  radius={[0, 4, 4, 0]}
                  name="employed"
                >
                  <LabelList 
                    dataKey="employed" 
                    position="right" 
                    style={{ 
                      fontSize: 11, 
                      fontWeight: 500,
                      fill: '#065f46'
                    }} 
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>

                {/* Unemployed Bar */}
                <Bar 
                  dataKey="unemployed" 
                  fill="var(--color-unemployed)" 
                  radius={[0, 4, 4, 0]}
                  name="unemployed"
                >
                  <LabelList 
                    dataKey="unemployed" 
                    position="right" 
                    style={{ 
                      fontSize: 11, 
                      fontWeight: 500,
                      fill: '#991b1b'
                    }} 
                    formatter={(value: number) => formatNumber(value)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
<Label>Total response per year</Label>
        {/* Chart Legend */}
       <div
  className="flex flex-wrap justify-center gap-4 pt-2"
  style={{
    '--color-total': chartConfig.total.color,
    '--color-employed': chartConfig.employed.color,
    '--color-unemployed': chartConfig.unemployed.color,
  } as React.CSSProperties}
>
  
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-sm bg-[var(--color-total)]"></div>
    <span className="text-sm font-medium text-gray-700">Total Alumni</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-sm bg-[var(--color-employed)]"></div>
    <span className="text-sm font-medium text-gray-700">Employed</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-sm bg-[var(--color-unemployed)]"></div>
    <span className="text-sm font-medium text-gray-700">Unemployed</span>
  </div>
</div>

      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1 text-sm pt-4 border-t">
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Employment trends over {sanitizedData.length} years</span>
        </div>
        <div className="text-gray-500">
          Data updated {new Date().toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  )
}