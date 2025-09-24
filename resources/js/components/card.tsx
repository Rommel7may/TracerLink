import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';

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
        <div className="w-full bg-gray-50 px-6 py-6 dark:bg-zinc-950">
            <div className="mb-6">
                <h1 className="font-semibold text-gray-800 dark:text-gray-200">Program Statistics</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Overview of response metrics across all programs</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Graduates */}
                <Card className="overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardDescription className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                    Overall Responses Across All Programs
                                </CardDescription>
                                <CardTitle className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</CardTitle>
                            </div>
                            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                                <GraduationCap className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter className="border-t border-gray-100 bg-gray-50 py-3 text-sm text-gray-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-gray-400">
                        <Users className="mr-1.5 h-4 w-4" />
                        Across {programCount} programs
                    </CardFooter>
                </Card>

                {/* Per-Program Cards */}
                {programs.map((program) => (
                    <Card
                        key={program.id}
                        className="group overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-blue-700"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardDescription className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                        Responses on
                                    </CardDescription>
                                    <CardTitle className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                                        {program.name}
                                    </CardTitle>
                                </div>
                                {/* <div className="p-2 rounded-lg  dark:bg-zinc-800 dark:group-hover:bg-blue-900/30 transition-colors">
                </div> */}
                            </div>
                        </CardHeader>
                        <CardFooter className="mt-auto border-t border-gray-100 bg-gray-50 py-3 text-lg font-bold text-blue-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-blue-400">
                            {program.alumni_count.toLocaleString()} Responses
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
