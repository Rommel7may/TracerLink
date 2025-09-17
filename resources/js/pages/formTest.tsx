'use client';

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import JobPost from '@/components/JobPost';
import { AlumniForm } from '@/components/AlumniForm';



const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Test Form',
    href: '/test',
  },
];

export default function Data() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Opportunity" />

<div>
    <AlumniForm/>
</div>

    </AppLayout>
  );
}
