'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface JobFormProps {
  alumni: {
    id: number;
    given_name: string;
    email: string;
  };
  onSuccess?: () => void;
}

export default function JobFormForEmail({ alumni, onSuccess }: JobFormProps) {
  const [open, setOpen] = useState(true); // Auto-open if accessed from email link

  const { data, setData, post, processing, reset } = useForm({
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('job-posts.store'), {
      onSuccess: () => {
        toast.success('Job post created successfully');
        reset();
        setOpen(false);
        if (onSuccess) onSuccess();
      },
      onError: () => toast.error('Failed to create job post'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hello, {alumni.given_name}!</DialogTitle>
        </DialogHeader>
        <p className="mb-4">Please fill out the form below to create a new job post.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Job Title"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            required
          />
          <Textarea
            placeholder="Job Description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="submit" disabled={processing}>
              Save Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
