"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
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
import { usePage, useForm } from "@inertiajs/react"
import { PageProps } from "@/types"
import axios from "axios"
import { toast, Toaster } from "sonner"
import { SendEmailToProgram } from "./SendEmailToProgram"

export type Student = {
  id?: number
  student_number: string
  email: string
  program: string
}

export default function StudentIndex() {
  const { props } = usePage<PageProps>()
  const students = props.students as Student[]
  const [studentList, setStudentList] = React.useState<Student[]>(students)
  const [showModal, setShowModal] = React.useState(false)
  const [editId, setEditId] = React.useState<number | null>(null)
  const [globalFilter, setGlobalFilter] = React.useState("")


  const { data, setData, processing, errors, reset } = useForm({
    student_number: "",
    email: "",
    program: "",
  })

  React.useEffect(() => {
    setStudentList(students)
  }, [students])

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId) {
        const response = await axios.put(`/students/${editId}`, data)
        const updated = response.data
        setStudentList((prev) =>
          prev.map((s) => (s.id === editId ? updated : s))
        )
        toast.success("Student updated!", {
          description: `${updated.student_number} – ${updated.email}`,
        })
      } else {
        const response = await axios.post("/students", data)
        const created = response.data
        setStudentList((prev) => [...prev, created])
        toast.success("Student added!", {
          description: `${created.student_number} – ${created.email}`,
        })
      }
      reset()
      setEditId(null)
      setShowModal(false)
    } catch (err) {
      console.error(err)
      toast.error("Email or Student number has already taken..")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return
    try {
      await axios.delete(`/students/${id}`)
      setStudentList((prev) => prev.filter((s) => s.id !== id))
      toast.success("Student deleted!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete student ❌")
    }
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "student_number",
      header: "Student Number",
      cell: ({ row }) => <div>{row.getValue("student_number")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "program",
      header: "Program",
      cell: ({ row }) => <div className="capitalize">{row.getValue("program")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original
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
              <DropdownMenuItem className="text-blue-600" onClick={() => {
                setEditId(student.id!)
                setData({
                  student_number: student.student_number,
                  email: student.email,
                  program: student.program,
                })
                setShowModal(true)
              }}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id!)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: studentList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {globalFilter},
    globalFilterFn: (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase()
    return (
      row.original.student_number.toLowerCase().includes(search) ||
      row.original.email.toLowerCase().includes(search) ||
      row.original.program.toLowerCase().includes(search)
    )
  }
  })

  return (
      <div className="w-full">
          <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                  style: {
                      borderRadius: '8px',
                      background: '#1f2937',
                      color: '#fff',
                  },
              }}
          />
          <div className="flex items-center justify-between py-4">
              <Input
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="my-4 max-w-md"
              />

              <Button
                  onClick={() => {
                      reset();
                      setEditId(null);
                      setShowModal(true);
                  }}
              >
                  Add Student
              </Button>
              <SendEmailToProgram/>
          </div>

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

          <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitStudent} className="space-y-4">
                      <Input
                          placeholder="Student Number"
                          value={data.student_number}
                          onChange={(e) => setData('student_number', e.target.value)}
                          required
                      />
                      {errors.student_number && <p className="text-sm text-red-500">{errors.student_number}</p>}

                      <Input type="email" placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      <select
                          value={data.program}
                          onChange={(e) => setData('program', e.target.value)}
                          required
                          className="w-full appearance-none rounded-md border border-black bg-white px-3 py-2 text-sm text-black focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none dark:border-white dark:bg-black dark:text-white dark:focus-visible:ring-white"
                      >
                          <option value="">Select a program</option>
                          <option value="BS INFORMATION TECHNOLOGY">BS Information Technology</option>
                          <option value="BS BUSINESS ADMINISTRATION">BS Business Administration</option>
                          <option value="BS ENTREPRENEURSHIP">BS Entrepreneurship</option>
                          <option value="BS PSYCHOLOGY">BS Psychology</option>
                          <option value="BS CIVIL ENGINEERING">BS Civil Engineering</option>
                          <option value="Bachelor of Elementary Education">Bachelor of Elementary Education</option>
                          <option value="BS Tourism Management">BS Tourism Management</option>
                      </select>

                      {errors.program && <p className="text-sm text-red-500">{errors.program}</p>}

                      <DialogFooter>
                          <Button type="submit" disabled={processing}>
                              {editId ? 'Update' : 'Save'}
                          </Button>
                          <Button
                              type="button"
                              variant="ghost"
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
      </div>
  );
}
