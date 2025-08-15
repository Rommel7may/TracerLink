import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, School } from "lucide-react";

type Program = {
  id: number;
  name: string;
  alumni_count: number;
};

export function SectionCards({ programs = [] }: { programs: Program[] }) {
  const total = programs.reduce((sum, prog) => sum + prog.alumni_count, 0);

  return (
    <div className="w-full px-6 py-6">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Graduates */}
        <Card className="rounded-3xl shadow-lg p-6 bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-800 dark:to-zinc-900 transition hover:scale-[1.02] duration-300 ease-in-out">
          <CardHeader className="pb-3 space-y-1">
            <CardDescription className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-sm font-medium">
              Total Graduates
            </CardDescription>
            <CardTitle className="text-4xl font-extrabold flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
              <GraduationCap size={36} />
              {total.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-zinc-500 dark:text-zinc-400 pt-2">
            Across all programs
          </CardFooter>
        </Card>

        {/* Per-Program Cards */}
        {programs.map((program) => (
          <Card
            key={program.id}
            className="rounded-3xl shadow-md p-6 bg-white dark:bg-zinc-900 hover:ring-2 ring-blue-500/30 dark:hover:ring-blue-400/30 transition-all duration-300 ease-in-out"
          >
            <CardHeader className="pb-3 space-y-1">
              <CardDescription className="text-zinc-500 dark:text-zinc-400 uppercase text-xs tracking-wide">
                Program
              </CardDescription>
              <CardTitle className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                {program.name}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-2xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400 pt-2">
              <School size={26} />
              {program.alumni_count.toLocaleString()}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
