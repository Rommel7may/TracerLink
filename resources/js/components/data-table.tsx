"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Alumni = {
  student_number: string
  email: string
  program: string
  last_name: string
  given_name: string
  middle_initial?: string
  present_address: string
  active_email: string
  contact_number: string
  campus: 'lubao' | 'bacolor' | 'mexico'
  graduation_year: number
  college: 'cict' | 'cbm' | 'coe' | 'cte'
  employment_status: 'employed' | 'unemployed' | 'self-employed'
  further_studies?: 'no' | 'ma' | 'mba' | 'mit' | 'mce' | 'phd'
  sector: string
  work_location: string
  employer_classification: string
  consent: boolean
}

// Sample data — replace this with Laravel/Inertia/axios response
const data: Alumni[] = [
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },{
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },


  {
    student_number: "20220001",
    email: "juan@example.com",
    program: "BSIT",
    last_name: "Dela Cruz",
    given_name: "Juan",
    middle_initial: "R",
    present_address: "San Fernando, Pampanga",
    active_email: "juan.alt@example.com",
    contact_number: "09123456789",
    campus: "lubao",
    graduation_year: 2023,
    college: "cict",
    employment_status: "employed",
    further_studies: "no",
    sector: "Private",
    work_location: "Clark",
    employer_classification: "IT Services",
    consent: true,
  },
]

export const columns: ColumnDef<Alumni>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student_number",
    header: "Student #",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "program",
    header: "Program",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "given_name",
    header: "Given Name",
  },
  {
    accessorKey: "middle_initial",
    header: "M.I.",
  },
  {
    accessorKey: "campus",
    header: "Campus",
  },
  {
    accessorKey: "graduation_year",
    header: "Grad Year",
  },
  {
    accessorKey: "employment_status",
    header: "Employment",
  },
  {
    accessorKey: "further_studies",
    header: "Further Studies",
  },
  {
    accessorKey: "work_location",
    header: "Work Location",
  },
  {
    accessorKey: "employer_classification",
    header: "Employer Type",
  },
  {
    accessorKey: "consent",
    header: "Consent",
    cell: ({ row }) => (
      <div>{row.getValue("consent") ? "Yes" : "No"}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const alumni = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(alumni.student_number)
              }
            >
              Copy Student #
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AlumniTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by last name..."
          value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("last_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
