import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, School, TrendingUp, Users } from "lucide-react";

type Program = {
  id: number;
  name: string;
  alumni_count: number;
  growth?: number; // Added for potential future use
};

export function SectionCards({ programs = [] }: { programs: Program[] }) {
  const total = programs.reduce((sum, prog) => sum + prog.alumni_count, 0);
  const programCount = programs.length;

  return (
    <div className="w-full px-6 py-6 bg-gray-50 dark:bg-zinc-950">
      <div className="mb-6">
        <h1 className=" font-semibold text-gray-800 dark:text-gray-200">
          Program Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Overview of response metrics across all programs
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Graduates */}
        <Card className="rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
                  Total Response
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {total.toLocaleString()}
                </CardTitle>
              </div>
              <div className="p-3 rounded-lg bg-red-100 dark:bg-blue-900/30">
                <GraduationCap className="h-5 w-5 text-yellow-500 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-3">
            <Users className="h-4 w-4 mr-1.5" />
            Across {programCount} programs
          </CardFooter>
        </Card>

        {/* Average per Program */}
        {/* <Card className="rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
                  Average per Program
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {programCount > 0 ? Math.round(total / programCount).toLocaleString() : 0}
                </CardTitle>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-3">
            Mean graduates across all programs
          </CardFooter>
        </Card> */}

        {/* Per-Program Cards */}
        {programs.map((program) => (
          <Card
            key={program.id}
            className="rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">
                    Response per
                    program
                  </CardDescription>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mt-2 line-clamp-2">
                    {program.name}
                  </CardTitle>
                </div>
                <div className="p-2 rounded-lg bg-red-100 dark:bg-zinc-800 group-hover:bg-red-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <School className="h-4 w-4 text-yellow-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-red-400" />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="text-xl font-bold text-blue-600 dark:text-blue-400 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-3">
              {program.alumni_count.toLocaleString()} Responses
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}