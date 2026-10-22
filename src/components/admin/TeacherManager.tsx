import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button, Card } from '@/components/ui';
import { TeacherFormModal, type TeacherSummary } from './TeacherFormModal';

export const TeacherManager: React.FC = () => {
  const teachers = useQuery(api.teachers.queries.list);
  const removeTeacher = useMutation(api.teachers.mutations.remove);

  const [editingTeacher, setEditingTeacher] = useState<TeacherSummary | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (id: Id<'teachers'>) => {
    if (window.confirm('¿Archivar este profesor? Se conservarán las referencias de cursos existentes.')) {
      try {
        await removeTeacher({ id });
      } catch (err) {
        console.error('No se pudo archivar el profesor:', err);
        alert('No se pudo archivar el profesor');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de profesores</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Agregar profesor
        </Button>
      </div>

      <TeacherFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <TeacherFormModal
        teacher={editingTeacher}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTeacher(null);
        }}
      />

      {!teachers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-surface-container rounded-2xl" />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <Card className="p-8 text-center bg-surface-container text-on-surface-variant">
          No se encontraron profesores.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card
              key={teacher._id}
              className="bg-surface-container/60 border border-outline-variant p-5 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={teacher.imageUrl}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-full object-cover border border-outline-variant"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{teacher.name}</h3>
                    <p className="text-xs text-on-surface-variant">
                      {teacher.title}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-4">
                  {teacher.bio}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-outline-variant/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTeacher(teacher);
                    setIsEditModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error hover:bg-error/10"
                  onClick={() => handleDelete(teacher._id)}
                >
                  Archivar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
