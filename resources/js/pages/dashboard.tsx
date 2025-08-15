import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { SectionCards } from "@/components/card"
import { AlumniBarChart } from "@/components/alumni-bar-chart"
import AlumniRatingBarChart from "@/components/dashboard/AlumniRatingBarChart"
import { type BreadcrumbItem } from "@/types"

type Program = {
  id: number
  name: string
  alumni_count: number
}

type AlumniPerYear = {
  year: string
  total: number
  employed: number
  unemployed: number
}

type RatingCount = {
  star: number
  total: number
}

type DashboardProps = {
  programs: Program[]
  alumniPerYear: AlumniPerYear[]
  ratingCounts: RatingCount[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
]

export default function Dashboard({
  programs,
  alumniPerYear,
  ratingCounts,
}: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-10 p-6">
        {/* 🎓 Program Summary */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary tracking-tight">
            Program Summary
          </h2>
          <SectionCards programs={programs} />
        </div>

        {/* 👨‍💼 Alumni Employment Chart */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Alumni Employment Overview
          </h3>
          <AlumniBarChart alumniPerYear={alumniPerYear} />
        </div>

        {/* ⭐ Instruction Rating Chart */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Instruction Rating Overview
          </h3>
          <AlumniRatingBarChart ratingCounts={ratingCounts} />
        </div>
      </div>
    </AppLayout>
  )
}
