import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
} from '@/components/ui';

interface TeacherFormModalProps {
  teacher?: TeacherSummary | null;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface TeacherSummary {
  _id: Id<'teachers'>;
  name: string;
  title: string;
  imageUrl: string;
  bio: string;
  skills: string[];
  quote?: string;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  teacher,
  trigger,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (isControlled) {
      if (!val && externalOnClose) externalOnClose();
    } else {
      setInternalIsOpen(val);
    }
  };

  const formKey = teacher?._id ?? 'new';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-xl bg-surface border border-outline-variant rounded-3xl p-6 text-on-surface">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {teacher ? 'Editar profesor' : 'Agregar profesor'}
          </DialogTitle>
        </DialogHeader>

        <TeacherFormContent
          key={formKey}
          teacher={teacher}
          onSubmitted={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

interface TeacherFormContentProps {
  teacher?: TeacherSummary | null;
  onSubmitted: () => void;
  onCancel: () => void;
}

const TeacherFormContent: React.FC<TeacherFormContentProps> = ({
  teacher,
  onSubmitted,
  onCancel,
}) => {
  const createTeacher = useMutation(api.teachers.mutations.create);
  const updateTeacher = useMutation(api.teachers.mutations.update);

  const [name, setName] = useState(teacher?.name || '');
  const [title, setTitle] = useState(teacher?.title || '');
  const [imageUrl, setImageUrl] = useState(teacher?.imageUrl || '');
  const [bio, setBio] = useState(teacher?.bio || '');
  const [skillsInput, setSkillsInput] = useState(teacher?.skills?.join(', ') || '');
  const [quote, setQuote] = useState(teacher?.quote || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const data = {
      name,
      title,
      imageUrl,
      bio,
      skills,
      quote: quote ? quote : undefined,
    };

    try {
      if (teacher) {
        await updateTeacher({ id: teacher._id, patch: data });
      } else {
        await createTeacher(data);
      }
      onSubmitted();
    } catch (err) {
      console.error('Failed to save teacher:', err);
      alert('Failed to save teacher');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chef Marco"
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Título profesional</label>
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Master Grill Pitmaster"
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">URL del avatar</label>
        <Input
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Habilidades (separadas por coma)</label>
        <Input
          required
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="Live Fire, Argentine Grill, Smoke"
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Biografía</label>
        <textarea
          required
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mt-1 bg-surface-container border border-outline-variant rounded-xl p-3 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Instructor biography..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Cita</label>
        <Input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Optional inspirational quote"
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit">Guardar profesor</Button>
      </div>
    </form>
  );
};
