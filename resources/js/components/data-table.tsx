'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
} from '@tanstack/react-table';
import axios from 'axios';
import { DownloadIcon, MoreVertical, PlusCircle, SlidersHorizontal, UsersRound } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { AlumniForm } from './AlumniForm';

export type Alumni = {
  id?: number;
  student_number: string;
  email: string;
  program: { id: number; name: string } | number | string;
  last_name: string;
  given_name: string;
  middle_initial?: string;
  present_address: string;
  active_email: string;
  contact_number: string;
  graduation_year: number;
  college?: string;
  employment_status: string;
  further_studies?: string;
  sector: string;
  work_location: string;
  employer_classification: string;
  consent: boolean;
};


export function AlumniTable() {
    const [alumniData, setAlumniData] = React.useState<Alumni[]>([]);
    const [programs, setPrograms] = React.useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [editingAlumni, setEditingAlumni] = React.useState<Alumni | null>(null);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [sendEmailOpen, setSendEmailOpen] = React.useState(false);
    const [filter, setFilter] = React.useState<string>();
    const [pageSize, setPageSize] = React.useState(10);
    // Dynamically create graduation years from 2022 to current year (descending)
    const currentYear = new Date().getFullYear();
    const graduationYears = React.useMemo(() => {
        const years = [];
        for (let y = currentYear; y >= 2022; y--) {
            years.push(y.toString());
        }
        return years;
    }, [currentYear]);

    const fetchAlumni = () => {
        setLoading(true);
        axios
            .get('/alumni-data')
            .then((response) => {
                setAlumniData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching alumni data:', error);
                setLoading(false);
            });
    };

    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this record?')) return;

        axios
            .delete(`/alumni/${id}`)
            .then(() => {
                setAlumniData((prev) => prev.filter((a) => a.id !== id));
                toast.success('Deleted successfully');
            })
            .catch((err) => {
                console.error('Delete failed:', err);
                toast.error('Delete failed.');
            });
    };

    const handleSendEmails = async () => {
        try {
            const response = await axios.post('/send-email-to-all-alumni');
            const { sent, failed } = response.data;

            if (failed?.length) {
                const failedList = failed.map((f: any) => f.email).join(', ');
                toast.warning('Some emails failed to send ❗', {
                    description: `Failed: ${failedList}`,
                });
            } else {
                toast.success('Emails sent successfully to all alumni! 📧', {
                    description: `Total sent: ${sent.length}`,
                });
            }

            setSendEmailOpen(false);
        } catch (err: any) {
            const fallback = err?.response?.data?.message || 'Something went wrong.';
            toast.error('Failed to send emails', { description: fallback });
        }
    };

    React.useEffect(() => {
    fetchAlumni();

    // Kunin ang listahan ng programs
    axios.get('/api/programs')
        .then((res) => setPrograms(res.data))
        .catch((err) => console.error('❌ Hindi nakuha ang program list:', err));
}, []);


    const columns: ColumnDef<Alumni>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={
                        table.getFilteredSelectedRowModel().rows.length > 0 &&
                        table.getFilteredSelectedRowModel().rows.length <= 100 &&
                        table.getFilteredSelectedRowModel().rows.length === Math.min(100, table.getFilteredRowModel().rows.length)
                    }
                    onCheckedChange={(value) => {
                        const allRows = table.getFilteredRowModel().rows;
                        const rowsToSelect = allRows.slice(0, 100); // ✅ limit to 100

                        if (value) {
                            rowsToSelect.forEach((row) => row.toggleSelected(true));
                        } else {
                            table.toggleAllRowsSelected(false);
                        }
                    }}
                    aria-label="Select up to 100 rows"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        { accessorKey: 'student_number', header: 'Student #' },
        { accessorKey: 'email', header: 'Email' },
        {
  accessorKey: 'program_id',
  header: 'Program',
  cell: ({ row }) => {
    const prog = programs.find((p) => p.id === Number(row.original.program_id));
    return prog ? prog.name : '—';
  },
  filterFn: (row, columnId, filterValue) => {
    return row.getValue(columnId) === Number(filterValue);
  },
},



        { accessorKey: 'last_name', header: 'Last Name' },
        { accessorKey: 'given_name', header: 'Given Name' },
        { accessorKey: 'middle_initial', header: 'M.I.' },
        { accessorKey: 'graduation_year', header: 'Grad Year' },
        { accessorKey: 'employment_status', header: 'Employment' },
        { accessorKey: 'further_studies', header: 'Further Studies' },
        { accessorKey: 'work_location', header: 'Work Location' },
        { accessorKey: 'employer_classification', header: 'Employer Type' },
        {
            accessorKey: 'consent',
            header: 'Consent',
            cell: ({ row }) => <div>{row.getValue('consent') ? 'Yes' : 'No'}</div>,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => {
                const alumni = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-1">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuCheckboxItem
                                className="right-6 text-blue-600"
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                            >
                                View Details
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => {
                                    setEditingAlumni(alumni);
                                    setShowAddModal(true);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(alumni.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: alumniData,
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
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });
    const handleExport = async () => {
        try {
            const response = await axios.get('/export-alumni', {
                responseType: 'blob', // correct route and blob format
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'alumni-list.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Alumni list exported ✅');
        } catch (error: any) {
            toast.error('Export failed ❌', {
                description: error?.response?.data?.message || 'Something went wrong.',
            });
        }
    };
    // helper function to clear filter for a column
    const clearFilter = (id: string) => {
        setColumnFilters((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div className="w-full">
            {/* Filters and buttons container */}
            <div className="flex flex-col gap-3 py-4">
                {/* Top bar: Search + filter icon */}
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search.."
                        value={table.getState().globalFilter ?? ''}
                        onChange={(e) => table.setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* 3-dot filter menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 px-3">
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Filter</span>

                                {filter && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent triggering filter modal/dropdown
                                            setFilter('');
                                        }}
                                        className="ml-2 text-sm text-muted-foreground hover:text-red-500"
                                    >
                                        ✕
                                    </button>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 space-y-2 p-2" align="start">
                            {/* Year Filter */}
                            <Select
                                onValueChange={(val) => {
                                    if (val === '__clear__') clearFilter('graduation_year');
                                    else
                                        setColumnFilters((prev) => [
                                            ...prev.filter((f) => f.id !== 'graduation_year'),
                                            { id: 'graduation_year', value: val },
                                        ]);
                                }}
                                value={(table.getColumn('graduation_year')?.getFilterValue() as string) || ''}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter by Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__clear__">Clear Filter</SelectItem>
                                    {graduationYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Program Filter */}
<Select
  onValueChange={(val) => {
    if (val === '__clear__') clearFilter('program_id');
    else
      setColumnFilters((prev) => [
        ...prev.filter((f) => f.id !== 'program_id'),
        { id: 'program_id', value: Number(val) },
      ]);
  }}
  value={String(table.getColumn('program_id')?.getFilterValue() ?? '')}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Filter by Program" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__clear__">Clear Filter</SelectItem>
    {programs.map((prog) => (
      <SelectItem key={prog.id} value={String(prog.id)}>
        {prog.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>



                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex w-full items-center justify-between">
                    {/* Left side: Add Student */}
                    <Dialog
                        open={showAddModal}
                        onOpenChange={(open) => {
                            setShowAddModal(open);
                            if (!open) setEditingAlumni(null);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="flex items-center bg-green-600 text-white">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}</DialogTitle>
                                <DialogDescription>
                                    {editingAlumni
                                        ? 'Update the alumni information and submit to save changes.'
                                        : 'Fill out the form and submit to add a new record.'}
                                </DialogDescription>
                            </DialogHeader>

                            <AlumniForm
  key={editingAlumni?.student_number || 'create'}
  mode={editingAlumni ? 'edit' : 'create'}
  id={editingAlumni?.id}
  student_number={editingAlumni?.student_number}
  email={editingAlumni?.email}
  program_id={
    typeof editingAlumni?.program === 'object'
      ? editingAlumni.program.id
      : editingAlumni?.program
  }
  last_name={editingAlumni?.last_name}
  given_name={editingAlumni?.given_name}
  middle_initial={editingAlumni?.middle_initial}
  present_address={editingAlumni?.present_address}
  active_email={editingAlumni?.active_email}
  contact_number={editingAlumni?.contact_number}
  graduation_year={editingAlumni?.graduation_year?.toString()}
  employment_status={editingAlumni?.employment_status}
  company_name={editingAlumni?.company_name}
  further_studies={editingAlumni?.further_studies}
  sector={editingAlumni?.sector}
  work_location={editingAlumni?.work_location}
  employer_classification={editingAlumni?.employer_classification}
  related_to_course={editingAlumni?.related_to_course}
  consent={editingAlumni?.consent ?? false}
  onSuccess={() => {
    fetchAlumni();
    setShowAddModal(false);
    setEditingAlumni(null);
  }}
/>


                        </DialogContent>
                    </Dialog>

                    {/* Right side: Send Email + Export */}
                    <div className="flex items-center gap-3">
                        <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="flex items-center">
                                    <UsersRound className="mr-2 h-4 w-4" />
                                    Send Email to All Alumni
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Send to All Alumni</DialogTitle>
                                    <DialogDescription>
                                        This will send email to <b>all alumni with consent and email</b>.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="pt-4">
                                    <Button onClick={handleSendEmails}>Send Now</Button>
                                    <Button variant="ghost" onClick={() => setSendEmailOpen(false)}>
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" onClick={handleExport}>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Export Alumni List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="py-10 text-center text-muted">Loading alumni data...</div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            )}

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
            <div className="yes flex items-center justify-end gap-2 py-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                    className="rounded border px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white"
                    value={pageSize}
                    onChange={(e) => {
                        const newSize = Number(e.target.value);
                        setPageSize(newSize);
                        table.setPageSize(newSize);
                    }}
                >
                    {[10, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
