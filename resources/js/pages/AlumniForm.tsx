import { AlumniForm } from '@/components/AlumniForm';
import { type BreadcrumbItem } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Alumni Form',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  return (
 
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
       <AlumniForm student_number={'student_number'} email={'email'} />
      </div>
  );
}
