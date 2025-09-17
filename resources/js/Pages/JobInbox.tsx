'use client';

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import JobInbox from '@/components/JobInbox';

type Program = {
  id: number;
  name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Job Inbox',
    href: '/job-inbox',
  },
];

export default function Data() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Opportunity" />

<div>
    <JobInbox/>
</div>

    </AppLayout>
  );
}
