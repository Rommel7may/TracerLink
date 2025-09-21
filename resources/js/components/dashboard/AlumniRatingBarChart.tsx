"use client"

import {
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, Users, TrendingUp, Award } from "lucide-react"

type Props = {
  ratingCounts: {
    star: number
    total: number
  }[]
}

export default function AlumniRatingBarChart({ ratingCounts }: Props) {
  // Calculate statistics FIRST
  const totalResponses = ratingCounts.reduce((sum, item) => sum + item.total, 0)
  const averageRating = totalResponses > 0 
    ? ratingCounts.reduce((sum, item) => sum + (item.star * item.total), 0) / totalResponses 
    : 0
  const positiveRatingPercentage = totalResponses > 0
    ? Math.round((ratingCounts.filter(r => r.star >= 4).reduce((sum, item) => sum + item.total, 0) / totalResponses) * 100)
    : 0

  // Then create chart data
  const chartData = [1, 2, 3, 4, 5].map((star) => {
    const match = ratingCounts.find((r) => r.star === star)
    return {
      star,
      total: match?.total || 0,
      percentage: match?.total ? Math.round((match.total / totalResponses) * 100) : 0
    }
  })

  return (
    <Card className="rounded-xl border-0 shadow-lg bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Instruction Quality Ratings</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Distribution of alumni feedback on teaching quality
            </CardDescription>
          </div>
          {/* <div className="p-3 rounded-full bg-amber-100">
            <Award className="h-6 w-6 text-amber-600" />
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-300/10 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-blue-200">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{totalResponses.toLocaleString()}</div>
            <div className="text-xs font-medium text-blue-600">Total Responses</div>
          </div>
          
          <div className="bg-green-300/10 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-green-200">
                <Star className="h-5 w-5 text-green-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-700">{averageRating.toFixed(1)}</div>
            <div className="text-xs font-medium text-green-600">Average Rating</div>
          </div>
          
          <div className="bg-purple-300/10 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-purple-200">
                <TrendingUp className="h-5 w-5 text-purple-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">{positiveRatingPercentage}%</div>
            <div className="text-xs font-medium text-purple-600">Positive (4-5 stars)</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
              barSize={32}
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
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              
              <YAxis 
                type="category" 
                dataKey="star" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 14, fill: '#374151', fontWeight: 600 }}
                width={40}
              />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
                formatter={(value, name, props) => [
                  `${value} alumni (${props.payload.percentage}%)`,
                  `${props.payload.star}-Star Rating`,
                ]}
              />

              <Bar
                dataKey="total"
                radius={[0, 4, 4, 0]}
                fill="url(#rating-gradient)"
              >
                {/* Total count label at the end of each bar */}
                <LabelList
                  dataKey="total"
                  position="right"
                  style={{ 
                    fontSize: 12, 
                    fontWeight: 600,
                    fill: ''
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />

                {/* Percentage label inside the bar */}
                <LabelList
                  dataKey="percentage"
                  position="insideLeft"
                  offset={10}
                  style={{ 
                    fontSize: 11, 
                    fontWeight: 600,
                    fill: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                  formatter={(value: number) => `${value}%`}
                />

                {/* Star icons on the left side */}
                <LabelList
                  dataKey="star"
                  position="left"
                  offset={-30}
                  content={({ x = 0, y = 0, value }) => (
                    <foreignObject 
                      x={Number(x) - 28} 
                      y={Number(y) + 8} 
                      width={24} 
                      height={24}
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full">
                        <Star
                          size={14}
                          fill="#f59e0b"
                          stroke="#000"
                          strokeWidth={1.5}
                        />
                      </div>
                    </foreignObject>
                  )}
                />
              </Bar>

              <defs>
                <linearGradient id="rating-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Scale Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Rating Scale:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} className="flex items-center">
                  <Star size={12} fill="#f59e0b" stroke="#000" strokeWidth={1} />
                  <span className="text-xs ml-0.5">{star}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {totalResponses} total ratings collected
          </div>
        </div>
      </CardContent>
    </Card>
  )
}