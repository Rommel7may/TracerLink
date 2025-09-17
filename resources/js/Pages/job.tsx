'use client';

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import JobPost from '@/components/JobPost';



const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Data Analytics',
    href: '/jobpost',
  },
];

export default function Data() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Opportunity" />

<div>
    <JobPost/>
</div>

    </AppLayout>
  );
}
