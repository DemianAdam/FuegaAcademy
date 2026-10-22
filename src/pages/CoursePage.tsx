import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  CourseNotFound,
  CourseDetailLayout,
} from '../components/course';

export function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const course = useQuery(
    api.courses.queries.getPublishedBySlug,
    slug ? { slug } : 'skip',
  );

  if (course === undefined) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Cargando programa...</div>;
  }

  if (course === null) {
    return <CourseNotFound />;
  }

  return <CourseDetailLayout course={course} />;
}
