import { AlumniForm } from '@/components/AlumniForm';
import { type BreadcrumbItem } from '@/types';
import { title } from 'process';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Alumni Form',
    href: '/dashboard',
  },
];

export default function dashboard() {
  return (
    // Render the dashboard layout with the AlumniForm component
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
       <AlumniForm student_number={'student_number'} email={'email'} />
      </div>
  );
}
