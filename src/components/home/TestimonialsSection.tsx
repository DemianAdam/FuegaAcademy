import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { TestimonialCard } from '../shared/TestimonialCard';
import { testimonials } from '../../data/testimonials';

export function TestimonialsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="px-margin-desktop py-24"
      id="testimonios"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeader
          tagKey="testimonials.sectionTag"
          titleKey="testimonials.sectionTitle"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}