import { ChartAreaInteractive } from '@/components/bar';
import { SectionCards } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Badge } from 'lucide-react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { DayButton, DayPicker } from 'react-day-picker';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Send Job Email',
    href: '/job',
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
       <div className="flex items-center justify-center min-h-screen bg-black-100">
      <svg
        viewBox="0 0 300 400"
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="400"
      >
        {/* Palm */}
        <rect x="110" y="180" width="100" height="130" rx="50" fill="#f9c9a9" />

        {/* Thumb */}
        <rect
          x="85"
          y="220"
          width="25"
          height="80"
          rx="15"
          fill="#f9c9a9"
          transform="rotate(-35 97 240)"
        />

        {/* Index finger */}
        <rect x="115" y="150" width="20" height="60" rx="10" fill="#f9c9a9" />

        {/* Ring finger */}
        <rect x="165" y="150" width="20" height="50" rx="10" fill="#f9c9a9" />

        {/* Pinky finger */}
        <rect x="191" y="170" width="18" height="40" rx="9" fill="#f9c9a9" />

        {/* Middle finger - BIG & TALL */}
        <rect x="140" y="50" width="20" height="140" rx="10" fill="#f9c9a9" />

        {/* Text below for fun */}
        <text x="150" y="370" textAnchor="middle" fontSize="20" fill="#fff">
          FOR YOU MOTHER FUCKER
        </text>
      </svg>
    </div>
    <div><Button>Save</Button></div>
    <div><Alert>Alert</Alert></div>
    <div><AlertTitle>Alert Title</AlertTitle></div>
    <div><AlertDescription>Alert Description</AlertDescription></div>
    <div><InputError></InputError></div>
      </div>
    </AppLayout>
  );
}
