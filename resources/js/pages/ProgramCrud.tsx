import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Program = {
    id: number;
    name: string;
    alumni_count?: number;
};

type Props = {
    programs: Program[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Program', href: '/program' }];

export default function ProgCrud({ programs }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [programIdToDelete, setProgramIdToDelete] = useState<number | null>(null);

    const page = usePage().props as any;
    const flash = page?.flash ?? {};

    const { data, setData, post, put, reset, processing } = useForm({
        name: '',
    });

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const openAddModal = () => {
        reset();
        setEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (program: Program) => {
        setEditMode(true);
        setEditingProgram(program);
        setData('name', program.name);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && editingProgram) {
            put(`/program/${editingProgram.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
                onError: () => {
                    toast.error('Failed to update program.');
                },
            });
        } else {
            post('/program', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
                onError: () => {
                    toast.error('Failed to add program.');
                },
            });
        }
    };

    const confirmDelete = () => {
        if (programIdToDelete) {
            router.delete(`/program/${programIdToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Program deleted successfully.');
                    setDeleteDialog(false);
                    setProgramIdToDelete(null);
                },
                onError: (errors: any) => {
                    toast.error(errors?.message || errors?.error || 'Failed to delete program.');
                },
            });
        }
    };

    const openDeleteDialog = (id: number) => {
        setProgramIdToDelete(id);
        setDeleteDialog(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program CRUD" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Program List</h1>
                    <Button onClick={openAddModal}>Add Program</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-zinc-800">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map((program) => (
                                <tr key={program.id} className="border-t">
                                    <td className="p-3">{program.id}</td>
                                    <td className="p-3">{program.name}</td>
                                    <td className="space-x-2 p-3 text-right">
                                        <Button size="sm" variant="secondary" onClick={() => openEditModal(program)}>
                                            Edit
                                        </Button>
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={!!program.alumni_count}
                                                    onClick={() => openDeleteDialog(program.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                Cannot be deleted if there are alumni associated with this program.
                                            </HoverCardContent>
                                        </HoverCard>
                                    </td>
                                </tr>
                            ))}
                            {programs.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-3 text-center text-muted-foreground">
                                        No programs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Program Dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editMode ? 'Edit Program' : 'Add Program'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="programName">Program Name</Label>
                            <Input
                                id="programName"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editMode ? 'Update' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this program? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
