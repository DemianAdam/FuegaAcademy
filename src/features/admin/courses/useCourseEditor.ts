import { useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { CourseCreateInput } from '@shared/validators/courses';

export type CourseEditorState = CourseCreateInput;

export function createEmptyCourse(): CourseEditorState {
  return {
    title: '',
    description: '',
    imageUrl: '',
    polaroidImage: '',
    polaroidCaption: '',
    badge: 'popular',
    duration: 16,
    format: 'hybrid',
    teacherId: '' as Id<'teachers'>,
    achievements: [
      {
        icon: 'check_circle',
        text: 'Describe a concrete outcome for the student',
        isHighlighted: true,
      },
    ],
    pricing: {
      live: { amountMinor: 49900, currency: 'ARS' },
      recorded: { amountMinor: 29900, currency: 'ARS' },
    },
    status: 'draft',
    schedules: [
      {
        name: 'Primary cohort',
        capacity: 30,
        sessions: [
          { day: 1, startTime: '18:00', endTime: '20:00' },
          { day: 3, startTime: '18:00', endTime: '20:00' },
        ],
      },
    ],
    modules: [
      {
        title: 'Módulo 1',
        lessons: [{ title: 'Introducción', durationMinutes: 30, description: '' }],
      },
    ],
  };
}

export function useCourseEditor() {
  const [course, setCourse] = useState<CourseEditorState>(() =>
    createEmptyCourse(),
  );

  const update = <Key extends keyof CourseEditorState>(
    key: Key,
    value: CourseEditorState[Key],
  ) => setCourse((current) => ({ ...current, [key]: value }));

  return { course, setCourse, update };
}
