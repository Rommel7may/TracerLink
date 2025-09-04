'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageProps } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { DownloadCloudIcon, MoreHorizontal, PlusIcon, Trash } from 'lucide-react';
import * as React from 'react';
import { toast, Toaster } from 'sonner';
import { SendEmailToSelected } from './SendEmailToProgram';

// Added imports for export
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export type Student = {
    id?: number;
    student_number: string;
    student_name: string;
    email?: string;
};

export default function StudentIndex() {
    const { props } = usePage<PageProps>();
    const students = props.students as unknown as Student[];

    const [studentList, setStudentList] = React.useState<Student[]>(students);
    const [showModal, setShowModal] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [excelFile, setExcelFile] = React.useState<File | null>(null);
    const [rowSelection, setRowSelection] = React.useState({});

    const { data, setData, reset, processing } = useForm({
        id: '',
        student_number: '',
        student_name: '',
        email: '',
    });

    React.useEffect(() => {
        setStudentList(students);
    }, [students]);

    // Export to Excel
    // Export to Excel with header highlight and column spacing
const exportToExcel = (data: Student[]) => {
    if (!data.length) {
        toast.error('No data to export!');
        return;
    }

    // Prepare data
    const exportData = data.map((student) => ({
        'Student Number': student.student_number,
        'Student Name': student.student_name,
        'Email': student.email || '',
    }));

    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Highlight header row
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || '');
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // first row = header
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } }, // white text
            fill: { fgColor: { rgb: "4F46E5" } },          // indigo header
            alignment: { horizontal: "center", vertical: "center" },
        };
    }

    // Column widths for readability
    ws['!cols'] = [
        { wch: 20 }, // Student Number
        { wch: 30 }, // Student Name
        { wch: 30 }, // Email
    ];

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
};


    // Handle Excel Upload
    const handleExcelUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!excelFile) return;

        const formData = new FormData();
        formData.append('file', excelFile);

        try {
            const res = await axios.post('/students/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message || 'Import successful!');
            setShowUploadModal(false);
            router.get('/send', {
                only: [students],
                preserveState: true,
                replace: true,
            });
            setExcelFile(null);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Import failed!');
        }
    };

    // Add/Edit Student
    const handleSubmitStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                const response = await axios.put(`/students/${editId}`, data);
                const updated = response.data;
                setStudentList((prev) => prev.map((s) => (s.id === editId ? updated : s)));
                toast.success('Student updated!', { description: `${updated.student_number} – ${updated.student_name}` });
            } else {
                const response = await axios.post('/students', data);
                const created = response.data;
                setStudentList((prev) => [...prev, created]);
                toast.success('Student added!', { description: `${created.student_number} – ${created.student_name}` });
            }
            reset();
            setEditId(null);
            setShowModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Email or Student number already exists.');
        }
    };

    // Single delete
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`/students/${id}`);
            setStudentList((prev) => prev.filter((s) => s.id !== id));
            toast.success('Student deleted!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete student ❌');
        }
    };

    // Table columns
    const columns: ColumnDef<Student>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="h-3 w-3"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => <input type="checkbox" className="h-3 w-3" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
        },
        {
            accessorKey: 'student_number',
            header: 'STUDENT NUMBER',
        },
        {
            accessorKey: 'student_name',
            header: 'STUDENT FULL NAME',
        },
        {
            accessorKey: 'email',
            header: 'EMAIL',
        },
        {
            id: 'actions',
            header: 'Action',
            enableHiding: false,
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="text-blue-600"
                                onClick={() => {
                                    setEditId(student.id!);
                                    setData({
                                        id: data.id,
                                        student_number: student.student_number,
                                        student_name: student.student_name,
                                        email: student.email || '',
                                    });
                                    setShowModal(true);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id!)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // React Table setup
    const table = useReactTable({
        data: studentList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: { rowSelection, globalFilter },
        globalFilterFn: (row, columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            return (
                row.original.student_number.toLowerCase().includes(search) ||
                row.original.student_name.toLowerCase().includes(search) ||
                (row.original.email?.toLowerCase().includes(search) ?? false)
            );
        },
    });

    type Student = {
        id: number;
        student_number: string;
        student_name: string;
        email?: string;
    };

    return (
        <div className="w-full">
            <Toaster position="top-right" richColors closeButton />

            {/* Controls */}
            <div className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
                {/* Left controls */}
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Search students..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button
                        variant="outline"
                        onClick={() => {
                            reset();
                            setEditId(null);
                            setShowModal(true);
                        }}
                    >
                        <PlusIcon className="h-5 w-5" />
                        Student
                    </Button>

                    <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                        <DownloadCloudIcon className="mr-1 h-5 w-5 text-blue-500" />
                        Import Excel
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => exportToExcel(table.getSelectedRowModel().rows.length ? table.getSelectedRowModel().rows.map((r) => r.original) : studentList)}
                    >
                        <DownloadCloudIcon className="mr-1 h-5 w-5 text-green-500" />
                        Export Excel
                    </Button>
                </div>

                {/* Right controls */}
                <div>
                    <SendEmailToSelected selectedStudents={table.getSelectedRowModel().rows.map((r) => r.original)} />
                </div>
            </div>

            {table.getSelectedRowModel().rows.length > 0 && (
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        onClick={async () => {
                            const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id);
                            if (!confirm(`Delete ${selectedIds.length} students?`)) return;

                            try {
                                await axios.post('/students/bulk-delete', { ids: selectedIds });
                                setStudentList((prev) => prev.filter((s) => !selectedIds.includes(s.id!)));
                                toast.success('Selected students deleted!');
                                setRowSelection({});
                            } catch (err) {
                                console.error(err);
                                toast.error('Failed to delete selected students ❌');
                            }
                        }}
                    >
                        <Trash className='text-red-500'/> {table.getSelectedRowModel().rows.length}
                    </Button>
                </div>
            )}

            {/* Table */}
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitStudent} className="space-y-4">
                        <Input hidden placeholder="id" value={data.id} onChange={(e) => setData('id', e.target.value)} />
                        <Input
                            placeholder="Student Number"
                            value={data.student_number}
                            onChange={(e) => setData('student_number', e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Student Name"
                            value={data.student_name}
                            onChange={(e) => setData('student_name', e.target.value)}
                            required
                        />
                        <Input type="email" placeholder="Email (Optional)" value={data.email} onChange={(e) => setData('email', e.target.value)} />

                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                {editId ? 'Update' : 'Save'}
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    reset();
                                    setEditId(null);
                                    setShowModal(false);
                                }}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Excel Upload Modal */}
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Students from Excel</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleExcelUpload}>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                            required
                            className="w-full rounded-md border p-2"
                        />
                        <DialogFooter>
                            <Button type="submit">Upload</Button>
                            <Button type="button" variant="ghost" onClick={() => setShowUploadModal(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
