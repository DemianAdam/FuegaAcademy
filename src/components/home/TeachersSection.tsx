import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { TeacherCard } from '../shared/TeacherCard';
import { teachers } from '../../data/teachers';

export function TeachersSection() {
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
          tagKey="teachers.sectionTag"
          titleKey="teachers.sectionTitle"
          action={{
            labelKey: 'teachers.viewAll',
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
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
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