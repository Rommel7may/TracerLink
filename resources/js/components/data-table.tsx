'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  ChevronDownIcon,
  DownloadIcon,
  FilterIcon,
  MoreVertical,
  PlusCircle,
  PlusIcon,
  SlidersHorizontal,
  Trash2Icon,
  UsersRound,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { AlumniForm } from './AlumniForm';
import { echo } from "@/echo";

export type Alumni = {
  id?: number;
  student_number: string;
  email: string;
  program_id: { id: number; name: string } | number | string;
  last_name: string;
  given_name: string;
  middle_initial?: string;
  present_address: string;
  active_email: string;
  contact_number: string;
  graduation_year: number;
  college?: string;
  sex?: string;
  employment_status: string;
  further_studies?: string;
  sector: string;
  work_location: string;
  employer_classification: string;
  consent: boolean;
  company_name?: string;
  related_to_course?: string;
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
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sendEmailOpen, setSendEmailOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [filter, setFilter] = React.useState<string>();
  const [pageSize, setPageSize] = React.useState(10);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  
  // Loading states for all actions
  const [deleteLoading, setDeleteLoading] = React.useState<number | null>(null);
  const [bulkDeleteLoading, setBulkDeleteLoading] = React.useState(false);
  const [sendEmailLoading, setSendEmailLoading] = React.useState(false);
  const [importLoading, setImportLoading] = React.useState(false);
  const [exportLoading, setExportLoading] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const graduationYears = React.useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= 2022; y--) {
      years.push(y.toString());
    }
    return years;
  }, [currentYear]);

  const fetchAlumni = () => {
    console.log('🔄 fetchAlumni() called');
    setLoading(true);
    axios
      .get('/alumni-data')
      .then((response) => {
        console.log('✅ Alumni data fetched:', response.data.length, 'items');
        setAlumniData([...response.data]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error fetching alumni data:', error);
        setLoading(false);
      });
  };

  const fetchPrograms = () => {
    axios.get('/api/programs')
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error('❌ Failed to fetch program list:', err));
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    
    setDeleteLoading(id);
    
    axios
      .delete(`/alumni/${id}`)
      .then(() => {
        setAlumniData((prev) => prev.filter((a) => a.id !== id));
        toast.success('Deleted successfully');
      })
      .catch((err) => {
        console.error('Delete failed:', err);
        toast.error('Delete failed.');
      })
      .finally(() => {
        setDeleteLoading(null);
      });
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key as keyof typeof rowSelection])
      .map((key) => alumniData[parseInt(key)].id)
      .filter((id): id is number => id !== undefined);

    if (selectedIds.length === 0) {
      toast.error('No records selected');
      return;
    }

    setBulkDeleteLoading(true);

    try {
      await axios.post('/alumni/bulk-delete', { ids: selectedIds });
      setAlumniData((prev) => prev.filter((a) => !selectedIds.includes(a.id!)));
      setRowSelection({});
      setBulkDeleteOpen(false);
      toast.success(`Deleted ${selectedIds.length} record(s) successfully`);
    } catch (err) {
      console.error('Bulk delete failed:', err);
      toast.error('Bulk delete failed.');
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleSendEmails = async () => {
    const selectedIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key as keyof typeof rowSelection])
      .map((key) => alumniData[parseInt(key)].id)
      .filter((id): id is number => id !== undefined);

    if (selectedIds.length === 0) {
      toast.error("No alumni selected ❌");
      return;
    }

    setSendEmailLoading(true);

    try {
      const response = await axios.post("/send-email-to-selected-alumni", { ids: selectedIds });
      const { sent, failed } = response.data;

      if (failed?.length) {
        toast.warning("Some emails failed ❗", {
          description: failed.join(", "),
        });
      } else {
        toast.success(`Emails sent successfully 📧`, {
          description: `Total sent: ${sent.length}`,
        });
      }

      setSendEmailOpen(false);
      setRowSelection({});
    } catch (err: any) {
      toast.error("Failed to send emails", {
        description: err?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setSendEmailLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file');
      return;
    }

    setImportLoading(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      await axios.post('/alumni/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Alumni imported successfully ✅');
      fetchAlumni();
      setImportOpen(false);
      setImportFile(null);
    } catch (err: any) {
      toast.error('Import failed ❌', {
        description: err?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setImportLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAlumni();
    fetchPrograms();
  }, []);

  // WebSocket connection for real-time updates
  React.useEffect(() => {
    console.log('🔌 Connecting to Reverb WebSocket for alumni updates...');

    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('Skipping WebSocket on server side');
      return;
    }
    
    if (!echo) {
      console.error('❌ Echo instance is not available');
      return;
    }

    console.log('✅ Echo instance found');

    // Add connection event listeners for debugging
    const connector = echo.connector as any;
    
    if (connector.pusher && connector.pusher.connection) {
      connector.pusher.connection.bind('connected', () => {
        console.log('✅ WebSocket connected successfully!');
      });

      connector.pusher.connection.bind('error', (error: any) => {
        console.error('❌ WebSocket connection error:', error);
      });
    }

    // Add a small delay to ensure everything is loaded
    const connectionTimeout = setTimeout(() => {
      try {
        console.log('📡 Creating WebSocket channel...');
        
        // Subscribe to the alumni channel
        const channel = echo.channel('alumni');
        
        console.log('✅ Channel created');

        const listener = (e: any) => {
          console.log('🎉 AlumniCreated event received:', e);
          
          // Refresh the data from server
          fetchAlumni();

          toast.success(`${e.given_name} ${e.last_name} submitted form!`);
        };

        // Listen for the event
        channel.listen('.AlumniCreated', listener);
        
        console.log('✅ Successfully subscribed to alumni channel');

      } catch (error) {
        console.error('❌ Error setting up WebSocket connection:', error);
      }
    }, 1000); // 1 second delay

    // Cleanup function
    return () => {
      clearTimeout(connectionTimeout);
      try {
        if (echo) {
          echo.leaveChannel('alumni');
          console.log('👋 Left alumni channel');
        }
      } catch (error) {
        console.error('❌ Error leaving channel:', error);
      }
    };
  }, []); // Empty dependency array

  const columns: ColumnDef<Alumni>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
    { accessorKey: 'student_number', header: 'Student No.', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'email', header: 'Email', cell: ({ getValue }) => getValue() || 'N/A' },
    {
      accessorKey: 'program_id',
      header: 'Program',
      cell: ({ row }) => {
        const programValue = row.original.program_id;
        const programId =
          programValue &&
          typeof programValue === 'object' &&
          'id' in programValue &&
          programValue.id != null
            ? (programValue as { id: number }).id
            : Number(programValue);

        const prog = programs.find(p => p.id === programId);
        return prog ? prog.name : '—';
      },
      filterFn: (row, columnId, filterValue) => {
        const programValue = row.getValue(columnId);
        const programId =
          programValue &&
          typeof programValue === 'object' &&
          'id' in programValue &&
          programValue.id != null
            ? (programValue as { id: number }).id
            : Number(programValue);

        return programId === Number(filterValue);
      }
    },
    { accessorKey: 'last_name', header: 'Last Name', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'given_name', header: 'Given Name', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'middle_initial', header: 'M.I.', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'present_address', header: 'Present address.', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'sex', header: 'Sex', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'graduation_year', header: 'Grad Year', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'employment_status', header: 'Employment', filterFn: "equals", cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'company_name', header: 'Company', filterFn: "equals", cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'further_studies', header: 'Further Studies', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'work_location', header: 'Work Location', cell: ({ getValue }) => getValue() || 'N/A' },
    { accessorKey: 'employer_classification', header: 'Employer Type', cell: ({ getValue }) => getValue() || 'N/A' },
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
              <DropdownMenuItem
                onClick={() => {
                  setEditingAlumni(alumni);
                  setShowAddModal(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(alumni.id)}
                disabled={deleteLoading === alumni.id}
              >
                {deleteLoading === alumni.id ? 'Deleting...' : 'Delete'}
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
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  const handleExport = async () => {
    setExportLoading(true);
    
    try {
      const response = await axios.get('/export-alumni', {
        responseType: 'blob',
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
    } finally {
      setExportLoading(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="w-full">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search alumni..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

          {/* Advanced Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Filters
                {Object.keys(columnFilters).length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {Object.keys(columnFilters).length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 space-y-2 p-4" align="start">
              <h4 className="font-medium">Advanced Filters</h4>
              
              {/* Year Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Graduation Year</label>
                <Select
                  onValueChange={(val) => {
                    if (val === '__clear__') {
                      table.getColumn('graduation_year')?.setFilterValue('');
                    } else {
                      table.getColumn('graduation_year')?.setFilterValue(val);
                    }
                  }}
                  value={
                    (table.getColumn('graduation_year')?.getFilterValue() as string) || ''
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">Clear filter</SelectItem>
                    {graduationYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Program Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Program</label>
                <Select
                  onValueChange={(val) => {
                    if (val === '__clear__') {
                      table.getColumn('program_id')?.setFilterValue('');
                    } else {
                      table.getColumn('program_id')?.setFilterValue(Number(val));
                    }
                  }}
                  value={
                    String(table.getColumn('program_id')?.getFilterValue() || '')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__clear__">Clear filter</SelectItem>
                    {programs.map((prog) => (
                      <SelectItem key={prog.id} value={String(prog.id)}>
                        {prog.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Status Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Employment Status</label>
                <Select
                  onValueChange={(val) => {
                    if (val === '__clear__') {
                      table.getColumn('employment_status')?.setFilterValue('');
                    } else {
                      table.getColumn('employment_status')?.setFilterValue(val);
                    }
                  }}
                  value={
                    (table.getColumn('employment_status')?.getFilterValue() as string) || ''
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className='bg-gray-100 text-gray-700' value="__clear__">Clear filter</SelectItem>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setColumnFilters([])}
              >
                Clear all filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Combined New button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  New
                  <ChevronDownIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Student
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setImportOpen(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Import Alumni
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk actions */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  <Trash2Icon className=" h-4 " />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Send Email */}
            <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  disabled={selectedCount === 0}
                >
                  <UsersRound className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Email to Selected Alumni</DialogTitle>
                  <DialogDescription>
                    This will send email to <b>{selectedCount}</b> selected alumni.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-4">
                  <Button 
                    onClick={handleSendEmails}
                    disabled={sendEmailLoading}
                  >
                    {sendEmailLoading ? 'Sending...' : 'Send Now'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSendEmailOpen(false)}
                    disabled={sendEmailLoading}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>



            {/* Export */}
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={exportLoading}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {exportLoading ? 'Exporting...' : 'Export'}
            </Button>

            {/* Rows per page */}
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="1000000">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bulk Delete Confirmation */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected record(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete}
              disabled={bulkDeleteLoading}
            >
              {bulkDeleteLoading ? 'Deleting...' : `Delete ${selectedCount} record(s)`}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setBulkDeleteOpen(false)}
              disabled={bulkDeleteLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Alumni Modal */}
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) setEditingAlumni(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}
            </DialogTitle>
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
              typeof editingAlumni?.program_id === 'object'
                ? editingAlumni.program_id.id
                : editingAlumni?.program_id
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

      {/* Import Alumni Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Alumni</DialogTitle>
            <DialogDescription>
              Upload an Excel/CSV file containing alumni data.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) =>
              setImportFile(e.target.files?.[0] || null)
            }
          />
          <DialogFooter>
            <Button 
              onClick={handleImport} 
              disabled={!importFile || importLoading}
            >
              {importLoading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setImportOpen(false)}
              disabled={importLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading alumni data...
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-gray-900">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * pageSize,
            alumniData.length
          )}{" "}
          of {alumniData.length} entries
        </div>

        <div className="flex items-center gap-2">
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
  );
}