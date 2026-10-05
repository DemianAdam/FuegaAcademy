import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CoursePreview } from '../components/admin/CoursePreview';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import type { CourseInsertInput } from '@shared/validators/courses';
import type { Id } from '../../convex/_generated/dataModel';

export function AdminCourseCreatePage() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang?: string }>();
  const teachers = useQuery(api.teachers.queries.list) || [];
  const createCourse = useMutation(api.courses.mutations.create);

  const [formData, setFormData] = useState<Partial<CourseInsertInput>>({
    slug: '',
    title: '',
    description: '',
    imageUrl: '',
    polaroidImage: '',
    polaroidCaption: '',
    badge: 'popular',
    duration: 8,
    format: 'hybrid',
    teacherId: '' as Id<"teachers">,
    achievements: [{ icon: 'code', text: 'Construir aplicaciones reales con React 19 y TypeScript', isHighlighted: true }],
    pricing: {
      live: { amount: 499, currency: 'USD' },
      recorded: { amount: 299, currency: 'USD' },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedTeacher = teachers.find((t) => t._id === formData.teacherId);

  const handleChange = (field: keyof CourseInsertInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAchievementChange = (index: number, field: string, value: unknown) => {
    const updated = [...(formData.achievements || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, achievements: updated }));
  };

  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), { icon: 'check_circle', text: '', isHighlighted: false }],
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!formData.slug || !formData.title || !formData.teacherId) {
        throw new Error('Por favor completa los campos obligatorios: Slug, Título y Profesor.');
      }

      await createCourse(formData as CourseInsertInput);
      const redirectPath = lang ? `/${lang}/courses` : '/courses';
      navigate(redirectPath);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al crear el curso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Crear Nuevo Programa / Curso</h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Configura los detalles del curso y visualiza la vista previa interactiva en tiempo real.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(lang ? `/${lang}` : '/')}
          >
            Volver
          </Button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 text-error border border-error/20 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 space-y-6 bg-white dark:bg-surface-container border-outline-variant">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  Información Básica
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Slug (URL)*</label>
                    <Input
                      required
                      placeholder="ej. react-advanced"
                      value={formData.slug || ''}
                      onChange={(e) => handleChange('slug', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Título del Curso*</label>
                    <Input
                      required
                      placeholder="ej. Desarrollo Avanzado en React 19"
                      value={formData.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Descripción Completa*</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descripción detallada..."
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Duración (Semanas)</label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.duration ?? 8}
                      onChange={(e) => handleChange('duration', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Formato</label>
                    <select
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.format || 'hybrid'}
                      onChange={(e) => handleChange('format', e.target.value)}
                    >
                      <option value="live">En Vivo (Live)</option>
                      <option value="recorded">Grabado</option>
                      <option value="hybrid">Híbrido</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Badge</label>
                    <select
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.badge || ''}
                      onChange={(e) => handleChange('badge', e.target.value)}
                    >
                      <option value="">Sin Badge</option>
                      <option value="popular">Popular</option>
                      <option value="most-chosen">Más Elegido</option>
                      <option value="new">Nuevo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Profesor Responsable*</label>
                  <select
                    required
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.teacherId || ''}
                    onChange={(e) => handleChange('teacherId', e.target.value as Id<"teachers">)}
                  >
                    <option value="">Selecciona un profesor...</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.title})
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Media & Polaroid */}
              <Card className="p-6 space-y-6 bg-white dark:bg-surface-container border-outline-variant">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  Multimedia y Polaroid
                </h2>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">URL de Imagen Principal*</label>
                  <Input
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">URL de Polaroid*</label>
                    <Input
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formData.polaroidImage || ''}
                      onChange={(e) => handleChange('polaroidImage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Pie de Foto Polaroid*</label>
                    <Input
                      required
                      placeholder="ej. Code Review en vivo"
                      value={formData.polaroidCaption || ''}
                      onChange={(e) => handleChange('polaroidCaption', e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6 space-y-6 bg-white dark:bg-surface-container border-outline-variant">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">task_alt</span>
                    Logros del Estudiante
                  </h2>
                  <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                    + Agregar Logro
                  </Button>
                </div>

                <div className="space-y-4">
                  {(formData.achievements || []).map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant">
                      <Input
                        className="w-32"
                        placeholder="Icono (mdi)"
                        value={ach.icon}
                        onChange={(e) => handleAchievementChange(idx, 'icon', e.target.value)}
                      />
                      <Input
                        className="flex-1"
                        placeholder="Descripción del logro"
                        value={ach.text}
                        onChange={(e) => handleAchievementChange(idx, 'text', e.target.value)}
                      />
                      <label className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <input
                          type="checkbox"
                          checked={!!ach.isHighlighted}
                          onChange={(e) => handleAchievementChange(idx, 'isHighlighted', e.target.checked)}
                          className="rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        Destacar
                      </label>
                      <button
                        type="button"
                        onClick={() => removeAchievement(idx)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Pricing */}
              <Card className="p-6 space-y-6 bg-white dark:bg-surface-container border-outline-variant">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Precios y Planes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-surface border border-outline-variant space-y-3">
                    <h3 className="font-semibold text-sm text-on-surface">Plan en Vivo (Live)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={formData.pricing?.live?.amount ?? 499}
                        onChange={(e) =>
                          handleChange('pricing', {
                            ...formData.pricing,
                            live: {
                              amount: parseFloat(e.target.value) || 0,
                              currency: formData.pricing?.live?.currency || 'USD',
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Moneda"
                        value={formData.pricing?.live?.currency ?? 'USD'}
                        onChange={(e) =>
                          handleChange('pricing', {
                            ...formData.pricing,
                            live: {
                              amount: formData.pricing?.live?.amount || 0,
                              currency: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-outline-variant space-y-3">
                    <h3 className="font-semibold text-sm text-on-surface">Plan Grabado</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={formData.pricing?.recorded?.amount ?? 299}
                        onChange={(e) =>
                          handleChange('pricing', {
                            ...formData.pricing,
                            recorded: {
                              amount: parseFloat(e.target.value) || 0,
                              currency: formData.pricing?.recorded?.currency || 'USD',
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Moneda"
                        value={formData.pricing?.recorded?.currency ?? 'USD'}
                        onChange={(e) =>
                          handleChange('pricing', {
                            ...formData.pricing,
                            recorded: {
                              amount: formData.pricing?.recorded?.amount || 0,
                              currency: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(lang ? `/${lang}` : '/')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Crear Curso / Programa'}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5">
            <CoursePreview course={formData} teacherName={selectedTeacher?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
