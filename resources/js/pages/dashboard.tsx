import { ChartAreaInteractive } from '@/components/bar';
import { SectionCards } from '@/components/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Cards Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCards />
          <SectionCards />
          <SectionCards />
        </div>

        {/* Chart Section */}
        <div className="relative flex-1 overflow-hidden rounded-xl min-h-[300px]">
          <ChartAreaInteractive />
        </div>
      </div>
    </AppLayout>
  );
}
