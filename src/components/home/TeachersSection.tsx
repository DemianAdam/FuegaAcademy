import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SectionHeader } from '../ui/SectionHeader';
import { TeacherCard } from '@/features/teachers/components/TeacherCard';

export function TeachersSection() {
  const teachers = useQuery(api.teachers.queries.listPublished, {});
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="bg-surface-container-low px-margin-desktop py-24"
      id="profesores"
      aria-labelledby="teachers-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeader
          tag="Aprende de quienes hacen"
          title="Conocé a tus profesores."
          action={{
            label: 'View all teachers',
            href: '/teachers',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-3 gap-8"
        >
          {(teachers ?? []).slice(0, 3).map((teacher) => (
            <motion.div
              key={teacher._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <TeacherCard teacher={teacher} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
