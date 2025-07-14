
import StudentIndex from '@/components/send';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sending Email Form',
        href: '/send',
    },
];

export default function SendEmailForm() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SendEmailForm" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
               <StudentIndex/>
            </div>
        </AppLayout>
    );
}
