'use client';

import * as React from 'react';
import { usePage, useForm } from '@inertiajs/react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
    ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, useReactTable,
} from '@tanstack/react-table';
import { PageProps } from '@/types';
import { SendEmailToProgram } from './SendEmailToProgram';

export type Student = {
    id?: number;
    student_number: string;
    student_name: string;
    email: string;
    program: string;
};

export default function StudentIndex() {
    const { props } = usePage<PageProps>();
    const students = props.students as Student[];

    const [studentList, setStudentList] = React.useState<Student[]>(students);
    const [showModal, setShowModal] = React.useState(false);
    const [editId, setEditId] = React.useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [excelFile, setExcelFile] = React.useState<File | null>(null);
    const [rowSelection, setRowSelection] = React.useState({});

    const { data, setData, reset, processing, errors } = useForm({
        student_number: '',
        student_name: '',
        email: '',
    });

    React.useEffect(() => {
        setStudentList(students);
    }, [students]);

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
            setExcelFile(null);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Import failed!');
        }
    };

    // Handle single student add/edit
    const handleSubmitStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                const response = await axios.put(`/students/${editId}`, data);
                const updated = response.data;
                setStudentList(prev => prev.map(s => s.id === editId ? updated : s));
                toast.success('Student updated!', { description: `${updated.student_number} – ${updated.email}` });
            } else {
                const response = await axios.post('/students', data);
                const created = response.data;
                setStudentList(prev => [...prev, created]);
                toast.success('Student added!', { description: `${created.student_number} – ${created.email}` });
            }
            reset();
            setEditId(null);
            setShowModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Email or Student number already exists.');
        }
    };

    // Handle single delete
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`/students/${id}`);
            setStudentList(prev => prev.filter(s => s.id !== id));
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
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        },
        {
            accessorKey: 'student_number',
            header: 'ID',
        },
        {
            accessorKey: 'student_name',
            header: 'Student Number',
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            id: 'actions',
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
                                        student_number: student.student_number,
                                        student_name: student.student_name,
                                        email: student.email
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
                row.original.email.toLowerCase().includes(search) ||
                row.original.program.toLowerCase().includes(search)
            );
        },
    });

    return (
        <div className="w-full">
            <Toaster position="top-right" richColors closeButton />

            <div className="flex items-center justify-between py-4 gap-2">
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="my-4 max-w-md"
                />
                <Button onClick={() => { reset(); setEditId(null); setShowModal(true); }}>Add Student</Button>
                <Button
                    variant="destructive"
                    onClick={async () => {
                        const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.id);
                        if (!selectedIds.length) return toast.error('No students selected!');
                        if (!confirm(`Delete ${selectedIds.length} students?`)) return;

                        try {
                            await axios.post('/students/bulk-delete', { ids: selectedIds });
                            setStudentList(prev => prev.filter(s => !selectedIds.includes(s.id!)));
                            toast.success('Selected students deleted!');
                            setRowSelection({});
                        } catch (err) {
                            console.error(err);
                            toast.error('Failed to delete selected students ❌');
                        }
                    }}
                >
                    Bulk Delete
                </Button>
                <Button onClick={() => setShowUploadModal(true)}>Import Excel</Button>
                <SendEmailToProgram />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">No students found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
            </div>

            {/* Add/Edit Student Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitStudent} className="space-y-4">
                        <Input
                            placeholder="Student Number"
                            value={data.student_number}
                            onChange={e => setData('student_number', e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Student Name"
                            value={data.student_name}
                            onChange={e => setData('student_name', e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>{editId ? 'Update' : 'Save'}</Button>
                            <Button variant="ghost" type="button" onClick={() => { reset(); setEditId(null); setShowModal(false); }}>Close</Button>
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
                            onChange={e => setExcelFile(e.target.files?.[0] || null)}
                            required
                            className="w-full rounded-md border p-2"
                        />
                        <DialogFooter>
                            <Button type="submit">Upload</Button>
                            <Button type="button" variant="ghost" onClick={() => setShowUploadModal(false)}>Close</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
