"use client"

import {
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

type Props = {
  ratingCounts: {
    star: number
    total: number
  }[]
}

export default function AlumniRatingBarChart({ ratingCounts }: Props) {
  const chartData = [1, 2, 3, 4, 5].map((star) => {
    const match = ratingCounts.find((r) => r.star === star)
    return {
      star,
      total: match?.total || 0,
    }
  })

  return (
    <Card className="rounded-2xl border bg-background shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold text-foreground">
          ⭐ Instruction Rating Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of alumni responses (1 to 5 stars)
        </p>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 40, bottom: 10, left: 10 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground)" }}
            />
            <YAxis type="category" dataKey="star" hide />

            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
              }}
              formatter={(value, name, props) => [
                `${value} alumni`,
                `${props.payload.star} Star`,
              ]}
            />

            <Bar
              dataKey="total"
              radius={[4, 4, 4, 4]}
              barSize={28}
              fill="url(#blue-gradient)"
              isAnimationActive={true}
            >
              {/* 🧮 Total Count Label (end of bar) */}
              <LabelList
                dataKey="total"
                position="right"
                className="text-sm fill-foreground font-semibold"
              />

              {/* ⭐ Star icons (inside bar) */}
              <LabelList
                dataKey="star"
                position="insideLeft"
                content={({ x = 0, y = 0, value }) => (
                  <foreignObject x={Number(x) + 6} y={Number(y) + 6} width={80} height={24}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {[...Array(value)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="#facc15" // yellow
                          stroke="#000"  // black stroke for contrast
                          strokeWidth={1}
                          className="mr-0.5"
                        />
                      ))}
                    </div>
                  </foreignObject>
                )}
              />
            </Bar>

            <defs>
              <linearGradient id="blue-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
