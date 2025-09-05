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
import { DownloadCloudIcon, MoreHorizontal, PlusIcon, Trash, Search, FileUp } from 'lucide-react';
import * as React from 'react';
import { toast, Toaster } from 'sonner';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SendEmailToSelected } from './SendEmailToProgram';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
export type Student = {
    id: number;
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

    // Memoized export function
    const exportToExcel = React.useCallback((data: Student[]) => {
        if (!data.length) {
            toast.error('No data to export!');
            return;
        }

        const exportData = data.map((student) => ({
            'Student Number': student.student_number,
            'Student Name': student.student_name,
            'Email': student.email || '',
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const headerRange = XLSX.utils.decode_range(ws['!ref'] || '');
        
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;
            
            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: 'FFFFFF' } },
                fill: { fgColor: { rgb: '4F46E5' } },
                alignment: { horizontal: 'center', vertical: 'center' },
            };
        }

        ws['!cols'] = [
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        
        saveAs(blob, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
    }, []);

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
            router.reload();
            setExcelFile(null);
        } catch (err: any) {
            console.error('Import error:', err);
            toast.error(err.response?.data?.message || 'Import failed!');
        }
    };

    // Add/Edit Student
    const handleSubmitStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const url = editId ? `/students/${editId}` : '/students';
            const method = editId ? 'put' : 'post';
            
            const response = await axios[method](url, data);
            const studentData = response.data;

            setStudentList(prev => 
                editId 
                    ? prev.map(s => s.id === editId ? studentData : s)
                    : [...prev, studentData]
            );

            toast.success(`Student ${editId ? 'updated' : 'added'}!`, {
                description: `${studentData.student_number} – ${studentData.student_name}`
            });

            reset();
            setEditId(null);
            setShowModal(false);
        } catch (err: any) {
            console.error('Student operation error:', err);
            toast.error(err.response?.data?.message || 'Email or Student number already exists.');
        }
    };

    // Single delete
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        
        try {
            await axios.delete(`/students/${id}`);
            setStudentList(prev => prev.filter(s => s.id !== id));
            toast.success('Student deleted!');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Failed to delete student ❌');
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.id).filter(Boolean) as number[];
        
        if (!selectedIds.length || !confirm(`Delete ${selectedIds.length} students?`)) return;

        try {
            await axios.post('/students/bulk-delete', { ids: selectedIds });
            setStudentList(prev => prev.filter(s => !selectedIds.includes(s.id!)));
            toast.success('Selected students deleted!');
            setRowSelection({});
        } catch (err) {
            console.error('Bulk delete error:', err);
            toast.error('Failed to delete selected students ❌');
        }
    };

    // Table columns
    const columns: ColumnDef<Student>[] = React.useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
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
                                className="cursor-pointer"
                                onClick={() => {
                                    setEditId(student.id!);
                                    setData({
                                        id: student.id?.toString() || '',
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
                            <DropdownMenuItem 
                                className="text-red-600 cursor-pointer" 
                                onClick={() => student.id && handleDelete(student.id)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], []);

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
            const student = row.original;
            
            return (
                student.student_number.toLowerCase().includes(search) ||
                student.student_name.toLowerCase().includes(search) ||
                (student.email?.toLowerCase().includes(search) ?? false)
            );
        },
    });

    const selectedCount = table.getSelectedRowModel().rows.length;
    const currentData = selectedCount > 0 
        ? table.getSelectedRowModel().rows.map(r => r.original)
        : studentList;

    return (
        <div className="w-full p-6">
            <Toaster position="top-right" richColors closeButton />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600 mt-2">Manage your student records and communications</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
                {/* Left controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search students..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="max-w-xs pl-10"
                        />
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="gap-2">
                                <PlusIcon className="h-4 w-4" />
                                New
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                onClick={() => {
                                    reset();
                                    setEditId(null);
                                    setShowModal(true);
                                }}
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Student
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer gap-2"
                                onClick={() => setShowUploadModal(true)}
                            >
                                <FileUp className="h-4 w-4 text-blue-500" />
                                Import Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
{selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            className="gap-2"
                        >
                            <Trash className="h-4 w-4" />
                            Delete({selectedCount})
                        </Button>
                    )}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => exportToExcel(currentData)}
                        className="gap-2"
                    >
                        <DownloadCloudIcon className="h-4 w-4 text-green-500" />
                        Export Excel
                    </Button>
                    
                    <SendEmailToSelected selectedStudents={table.getSelectedRowModel().rows.map(r => r.original)} />
                    
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-lg border bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold text-gray-900">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                                    No students found. Add some students to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-gray-600">
                    Showing {table.getRowModel().rows.length} of {studentList.length} students
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()}
                        className="gap-1"
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()}
                        className="gap-1"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{editId ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitStudent} className="space-y-4">
                        <Input 
                            type="hidden" 
                            value={data.id} 
                            onChange={(e) => setData('id', e.target.value)} 
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Student Number</label>
                            <Input
                                placeholder="Enter student number"
                                value={data.student_number}
                                onChange={(e) => setData('student_number', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Student Name</label>
                            <Input
                                placeholder="Enter full name"
                                value={data.student_name}
                                onChange={(e) => setData('student_name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email (Optional)</label>
                            <Input 
                                type="email" 
                                placeholder="Enter email address" 
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)} 
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setEditId(null);
                                    setShowModal(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editId ? 'Update Student' : 'Add Student'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Excel Upload Modal */}
            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Import Students from Excel</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleExcelUpload} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excel File</label>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                                required
                                className="w-full rounded-md border border-gray-300 p-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-sm text-gray-500">
                                Supported formats: .xlsx, .xls
                            </p>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowUploadModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!excelFile}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload File
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}