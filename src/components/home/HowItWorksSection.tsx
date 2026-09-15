import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { StepCard } from '../shared/StepCard';
import { steps } from '../../data/steps';

export function HowItWorksSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="bg-surface-container-low px-margin-desktop py-24"
      id="como-funciona"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeader
          tagKey="howItWorks.sectionTag"
          titleKey="howItWorks.sectionTitle"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-3 gap-12"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <StepCard step={step} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}