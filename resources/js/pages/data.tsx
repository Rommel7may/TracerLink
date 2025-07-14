import { ChartAreaInteractive } from '@/components/bar';
import { SectionCards } from '@/components/card';
import { ChartPieLegend } from '@/components/pie-chart';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Data Analytics',
    href: '/data',
  },
];

export default function Data() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data" />
      <div className="flex center h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 justify-center">
      <ChartPieLegend/>
      </div>
    </AppLayout>
  );
}
