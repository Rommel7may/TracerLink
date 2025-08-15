'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button'; // ✅ Add this
import { ChartPieLegend } from '@/components/employment-pie-chart';
import LocationPieChart from '@/components/work-location-chart';
import RelatedChart from '@/components/YesNoPieChart';
import PursuingStudiesChart from '@/components/PursuingStudiesChart';
import TotalGraduatesChart from '@/components/TotalGraduatesChart';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Program = {
  id: number;
  name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Data Analytics',
    href: '/data',
  },
];

export default function Data() {
  const [selectedProgram, setSelectedProgram] = useState<string>();
  const [selectedYear, setSelectedYear] = useState<string>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/alumni-chart-options').then((res) => {
      setPrograms(res.data.programs);
      setYears(res.data.years);
    });
  }, []);

  // ✅ Clear filter handler
  const clearFilters = () => {
    setSelectedProgram(undefined);
    setSelectedYear(undefined);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data" />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 px-4 py-2 items-center">
        <Select onValueChange={setSelectedProgram} value={selectedProgram}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Program" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={String(program.id)}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedYear} value={selectedYear}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ✅ Clear Filter Button */}
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* First row of charts */}
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
        <div className="rounded-2xl">
          <ChartPieLegend programId={selectedProgram} year={selectedYear} />
        </div>
        <div className="rounded-2xl">
          <RelatedChart programId={selectedProgram} year={selectedYear} />
        </div>
        <div className="rounded-2xl">
          <LocationPieChart programId={selectedProgram} year={selectedYear} />
        </div>
      </div>

      {/* Second row of charts */}
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
        <div className="rounded-2xl">
          <PursuingStudiesChart programId={selectedProgram} year={selectedYear} />
        </div>
        <div className="rounded-2xl">
          <TotalGraduatesChart programId={selectedProgram ?? ''} year={selectedYear} />
        </div>
      </div>
    </AppLayout>
  );
}
