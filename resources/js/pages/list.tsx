import {  AlumniTable } from '@/components/data-table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Alumni List',
        href: '/list',
    },
];

export default function AlumniList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AlumniList" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                < AlumniTable/>
            </div>
        </AppLayout>
    );
}
