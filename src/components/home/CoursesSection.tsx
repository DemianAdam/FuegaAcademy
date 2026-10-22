import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SectionHeader } from '../ui/SectionHeader';
import { CourseCard } from '@/features/courses/components/CourseCard';

export function CoursesSection() {
  const courses = useQuery(api.courses.queries.listPublished, {});

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="px-margin-desktop py-24"
      id="cursos"
      aria-labelledby="courses-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeader
          tag="Nuestros Cursos"
          title="Eligí tu próximo paso."
          action={{
            label: 'Ver todos los cursos',
            href: '/courses',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-3 gap-8"
        >
          {courses === undefined ? (
            <div className="col-span-3 text-center py-12 text-on-surface-variant">Cargando programas...</div>
          ) : (
            courses.map((course) => (
              <motion.article
                key={course._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <CourseCard course={course} />
              </motion.article>
            ))
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
