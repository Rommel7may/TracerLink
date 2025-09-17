'use client';

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import Employability from '@/components/Employability';



const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Employability',
    href: '/employability',
  },
];

export default function Data() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Employability" />

<div>
    <Employability/>
</div>

    </AppLayout>
  );
}
