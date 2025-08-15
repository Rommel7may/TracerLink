// resources/js/components/AlumniFormModal.tsx
import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlumniForm } from './AlumniForm';

interface AlumniFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function AlumniFormModal({ open, onClose }: AlumniFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <AlumniForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
