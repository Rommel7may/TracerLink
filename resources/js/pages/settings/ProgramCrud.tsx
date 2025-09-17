import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';


import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import DeleteModal from '@/components/DeleteModal';

type Program = {
    id: number;
    name: string;
};

type Props = {
    programs: Program[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Program settings',
        href: '/settings/program',
    },
];
function handleDeleteProgram(id: number) {
    router.delete(`/program/${id}`);
}
export default function ProgramCrud({ programs }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    const {
        data,
        setData,
        delete: destroy,
        post,
        put,
        reset,
        processing,
        errors,
    } = useForm({
        name: '',
    });

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
            });
        } else {
            post('/program', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Manage Programs" description="Add, edit, or remove program names." />

                    <div className="flex justify-start">
                        <Button onClick={openAddModal}>Add Program</Button>
                    </div>

                    <div className="rounded-md ">
                        <Table className="w-full text-sm">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="p-3 text-left font-medium">Program Name</TableHead>
                                    <TableHead className="p-3 text-right whitespace-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.length > 0 ? (
                                    programs.map((program) => (
                                        <TableRow key={program.id} className="border-t">
                                            <TableCell className="p-3">{program.name}</TableCell>
                                            <TableCell className="space-x-2 p-3 text-right">
                                                <Button size="sm" variant="secondary" onClick={() => openEditModal(program)}>
                                                    Edit
                                                </Button>
                                                <DeleteModal
                                                    onConfirm={() => handleDeleteProgram(program.id)}
                                                    title="Delete Program"
                                                    description={`Are you sure you want to delete "${program.name}"? This cannot be undone.`}
                                                >
                                                    <Button variant="destructive" size="sm">
                                                        Delete
                                                    </Button>
                                                </DeleteModal>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="p-3 text-center text-muted-foreground">
                                            No programs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                            <div>
                                <h2 className="text-lg font-bold">{editMode ? 'Edit Program' : 'Add Program'}</h2>
                            </div>

                            <Dialog open={showModal} onOpenChange={setShowModal}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>{editMode ? 'Edit Program' : 'Add Program'}</DialogTitle>
                                        <DialogDescription>
                                            {editMode
                                                ? 'Update the name of the selected program.'
                                                : 'Fill in the name of the new program you want to add.'}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Program Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="e.g. BS Information Tachnology"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>

                                        <DialogFooter className="gap-2">
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={processing}>
                                                {editMode ? 'Update' : 'Save'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </SettingsLayout>
        </AppLayout>
    );
}
