import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PlayCircle, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const { t } = useTranslation('home');

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative py-16 md:py-24 flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          alt=""
          src="/images/hero-background.jpg"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-margin-desktop max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-4">
          {t('hero.tagline')}
        </p>
        <motion.h1
          id="hero-title"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="font-display-lg text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] mb-6"
        >
          {t('hero.headlinePart1')}
          <motion.em
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.2 } } }}
            className="text-secondary italic"
          >
            {t('hero.headlinePart2')}
          </motion.em>
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}
          className="font-body-lg text-xl text-on-surface-variant mb-10 max-w-xl leading-relaxed"
        >
          {t('hero.subheadline')}
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delay: 0.4 } } }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            className="bg-lima text-on-background px-8 py-4 font-bold rounded-full flex items-center gap-2 hover:translate-x-2 transition-transform"
          >
            {t('hero.ctaPrimary')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </motion.button>
          <motion.button
            variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
            className="bg-white/80 backdrop-blur border border-outline-variant text-on-surface px-8 py-4 font-bold rounded-full flex items-center gap-2 hover:bg-white transition-colors"
          >
            {t('hero.ctaSecondary')}
            <PlayCircle className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}