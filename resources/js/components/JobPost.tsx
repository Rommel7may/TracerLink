'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';

// Types
interface Job {
  id: number;
  title: string;
  description: string;
}

interface PageProps {
  jobs?: Job[];
  [key: string]: unknown;
}

export default function JobPost() {
  const { jobs = [] } = usePage<PageProps>().props;
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    title: '',
    description: '',
  });

  
  // Open add modal
  const openAdd = () => {
    reset();
    setEditId(null);
    setOpen(true);
  };

  // Open edit modal
  const openEdit = (job: Job) => {
    setData({ title: job.title, description: job.description });
    setEditId(job.id);
    setOpen(true);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      put(route('job-posts.update', { job_post: editId }), {
        onSuccess: () => {
          toast.success('Job post updated');
          reset();
          setOpen(false);
        },
      });
    } else {
      post(route('job-posts.store'), {
        onSuccess: () => {
          toast.success('Job post created');
          reset();
          setOpen(false);
        },
      });
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      destroy(route('job-posts.destroy', { job_post: id }), {
        onSuccess: () => toast.success('Job post deleted'),
      });
    }
  };

  // Handle sending email to unemployed alumni
const sendEmail = (jobId: number) => {
  if (confirm('Send this job to all unemployed alumni?')) {
    axios.post(route('job-posts.send-email'), { job_id: jobId })
      .then(() => toast.success('Emails sent successfully'))
      .catch(() => toast.error('Failed to send emails'));
  }
};


  return (
    <div className="p-6 space-y-4">
      <Button onClick={openAdd}>Add Job Post</Button>

      {/* Add/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Job Post' : 'Add Job Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Job Title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
            />
            <Textarea
              placeholder="Job Description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={processing}>
                {editId ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Posts Table */}
      <Table className="w-full border rounded-lg">
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead className="w-1/4">Title</TableHead>
            <TableHead className="w-2/4">Description</TableHead>
            <TableHead className="w-1/4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
       <TableBody>
  {jobs.length > 0 ? (
    jobs.map((job) => (
      <TableRow key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <TableCell className="font-medium">{job.title}</TableCell>
        <TableCell>{job.description}</TableCell>
        <TableCell className="text-center space-x-2">
          <Button size="sm" onClick={() => openEdit(job)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
          <Button
  size="sm"
  variant="secondary"
  onClick={() => sendEmail(job.id)}
>
  Send to Unemployed
</Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} className="text-center text-gray-500">
        No job posts found
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </div>
  );
}
