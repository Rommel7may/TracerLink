"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

type AlumniPerYear = {
  year: string
  employed: number
  unemployed: number
  total: number
}

const chartConfig = {
  total: {
    label: "Total Alumni",
    color: "var(--chart-3)",
  },
  employed: {
    label: "Employed",
    color: "var(--chart-1)",
  },
  unemployed: {
    label: "Unemployed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function AlumniBarChart({ alumniPerYear }: { alumniPerYear: AlumniPerYear[] }) {
  return (
    <Card className="w-full border border-muted shadow-sm">
      <CardHeader className="pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
          Alumni Employment Overview
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Yearly breakdown of alumni employment
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 overflow-x-auto">
        <ChartContainer config={chartConfig} className="h-[340px] w-full min-w-[600px]">
          <BarChart
            height={300}
            width={alumniPerYear.length * 75}
            data={alumniPerYear}
            barCategoryGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              style={{ fontSize: 12 }}
            />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={20}
              style={{ fontSize: 12 }}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={<ChartTooltipContent indicator="dot" />}
            />

            {/* ✅ Total comes first */}
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="total" position="top" style={{ fontSize: 11 }} />
            </Bar>
            <Bar dataKey="employed" fill="var(--color-employed)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="employed" position="top" style={{ fontSize: 11 }} />
            </Bar>
            <Bar dataKey="unemployed" fill="var(--color-unemployed)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="unemployed" position="top" style={{ fontSize: 11 }} />
            </Bar>

            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1 text-sm pt-2">
        <div className="flex items-center gap-2 font-medium">
          Updated {new Date().getFullYear()} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Includes all alumni responses by graduation year.
        </div>
      </CardFooter>
    </Card>
  )
}
