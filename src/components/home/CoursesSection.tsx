import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { CourseCard } from '../shared/CourseCard';
import { courses } from '../../data/courses';

export function CoursesSection() {
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
          tagKey="courses.sectionTag"
          titleKey="courses.sectionTitle"
          action={{
            labelKey: 'courses.viewAll',
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
          {courses.map((course) => (
            <motion.article
              key={course.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <CourseCard course={course} />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}