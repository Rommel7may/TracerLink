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
import { PageProps as InertiaPageProps } from '@inertiajs/core';

// Types
interface Job {
  id: number;
  title: string;
  description: string;
}

interface Program {
  id: number;
  name: string;
}

interface PageProps extends InertiaPageProps {
  jobs?: Job[];
  programs?: Program[];
}

export default function JobPost() {
  const { jobs = [], programs = [] } = usePage<PageProps>().props;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | ''>('');

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

  // Send email to unemployed alumni by program
  const sendEmail = (jobId: number) => {
    if (!selectedProgram) {
      toast.error('Please select a program before sending.');
      return;
    }

    if (confirm('Send this job to unemployed alumni in the selected program?')) {
      axios
        .post(route('job-posts.send-email'), {
          job_id: jobId,
          program_id: selectedProgram,
        })
        .then(() => toast.success('Emails sent successfully'))
        .catch(() => toast.error('No Unemployed found in this program'));
    }
  };

  // Send email to all employed alumni (new separate button)
  const sendEmailToAllEmployed = () => {
    if (confirm('Send email to ALL employed alumni?')) {
      axios
        .post(route('job-posts.send-email-to-all-employed')) // Make sure route matches web.php
        .then(() => toast.success('Emails sent to all employed alumni!'))
        .catch(() => toast.error('Failed to send emails.'));
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header Buttons */}
      <div className="flex gap-2">
        <Button onClick={openAdd}>Add Job Post</Button>
        <Button variant="secondary" onClick={sendEmailToAllEmployed}>
          Send Email to All Employed
        </Button>
      </div>

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

      {/* Program Selector */}
      <div>
        <label className="block mb-1 font-medium">Select Program for Email</label>
        <select
          className="border rounded p-2 w-full max-w-sm"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(Number(e.target.value) || '')}
        >
          <option value="">-- Select Program --</option>
          {programs.map((prog) => (
            <option key={prog.id} value={prog.id}>
              {prog.name}
            </option>
          ))}
        </select>
      </div>

      {/* Job Posts Table */}
      <Table className="w-full border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Title</TableHead>
            <TableHead className="w-2/4">Description</TableHead>
            <TableHead className="w-1/4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Button size="sm" onClick={() => openEdit(job)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
                  <Button size="sm" variant="secondary" onClick={() => sendEmail(job.id)}>Send Email</Button>
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
