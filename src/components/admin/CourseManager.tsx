import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Doc } from '../../../convex/_generated/dataModel';
import { Button, Card, Badge } from '@/components/ui';
import { LocalizedLink } from '@/components/shared';

export const CourseManager: React.FC = () => {
  const { t } = useTranslation('admin');
  const courses = useQuery(api.courses.queries.list);
  const removeCourse = useMutation(api.courses.mutations.remove);

  const handleDelete = async (id: Doc<'courses'>['_id']) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await removeCourse({ id });
      } catch (err) {
        console.error('Failed to delete course:', err);
        alert('Failed to delete course');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface-container/60 p-6 rounded-2xl border border-outline-variant">
        <div>
          <h3 className="text-xl font-bold">{t('courses.title')}</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Create and manage live, recorded, and hybrid masterclasses.
          </p>
        </div>
        <LocalizedLink to="/admin/courses/new">
          <Button>+ {t('courses.addNew')}</Button>
        </LocalizedLink>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-surface-container rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-8 text-center bg-surface-container text-on-surface-variant">
          No courses found.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const formatLabel =
              course.format === 'live'
                ? 'En Vivo'
                : course.format === 'recorded'
                ? 'Grabado'
                : 'Híbrido';
            const priceLive = course.pricing?.live?.amount
              ? `$${course.pricing.live.amount} ${course.pricing.live.currency || 'USD'}`
              : null;
            const priceRecorded = course.pricing?.recorded?.amount
              ? `$${course.pricing.recorded.amount} ${course.pricing.recorded.currency || 'USD'}`
              : null;

            return (
              <Card
                key={course._id}
                className="bg-surface-container/60 border border-outline-variant p-5 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-outline-variant">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.badge && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            course.badge === 'most-chosen' ||
                            course.badge === 'new' ||
                            course.badge === 'popular'
                              ? course.badge
                              : 'popular'
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
                      {formatLabel}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {course.duration} semanas
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">
                    {course.description}
                  </p>
                  {course.teacher && (
                    <p className="text-xs text-on-surface font-medium mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">person</span>
                      Instructor: {course.teacher.name}
                    </p>
                  )}
                  <div className="text-xs font-bold text-primary mb-4 flex gap-3">
                    {priceLive && <span>Live: {priceLive}</span>}
                    {priceRecorded && <span>Recorded: {priceRecorded}</span>}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-outline-variant/40">
                  <LocalizedLink to="/admin/courses/new">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </LocalizedLink>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error hover:bg-error/10"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
