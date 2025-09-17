import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { SectionCards } from "@/components/card"
import { AlumniBarChart } from "@/components/alumni-bar-chart"
import AlumniRatingBarChart from "@/components/dashboard/AlumniRatingBarChart"
import { type BreadcrumbItem } from "@/types"
import { GraduatesLineChart } from "@/components/OverviewGrar"
import GenderChart from "@/components/GenderChart"

type Program = {
  id: number
  name: string
  alumni_count: number
}

type AlumniPerYear = {
  year: string
  employed: number
  unemployed: number
  notTracked: number
  total: number
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

      <div className="flex flex-col gap-8 p-6 min-h-screen">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
        </div>

        {/* 🎓 Program Summary */}
        <div className="">
          <SectionCards programs={programs} />
        </div>

        {/* Grid Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graduates Line Chart */}
          <div className="gap-7">
            <GraduatesLineChart />
            <div className="mt-13">
               <AlumniRatingBarChart ratingCounts={ratingCounts} />
            </div>
            
          </div>

          {/* Gender Distribution Chart */}
          <div>
            <GenderChart />
            <div className="mt-1">
              <AlumniBarChart alumniPerYear={alumniPerYear} />
            </div>
             
                
          </div>

          {/* Alumni Employment Chart */}
          <div>
            <div className="">
            </div>
         
          </div>

       
           
          {/* yehey */}
          
        </div>
      </div>
    </AppLayout>
  )
}