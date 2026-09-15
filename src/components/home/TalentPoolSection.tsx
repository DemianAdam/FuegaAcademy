import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { talentPool } from '../../data/talentPool';

export function TalentPoolSection() {
  const { t } = useTranslation('home');

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="px-margin-desktop py-20"
      aria-labelledby="talent-pool-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-inverse-surface rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative Background Element */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="absolute top-0 right-0 w-64 h-64 bg-lima/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="material-symbols-outlined text-lima" aria-hidden="true">
                {talentPool.tagIcon}
              </span>
              <p className="text-lima font-bold text-xs uppercase tracking-widest">
                {t('talentPool.tag')}
              </p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              id="talent-pool-heading"
              className="text-white font-display-lg text-3xl md:text-4xl font-black leading-tight mb-4"
            >
              {t('talentPool.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-surface-dim font-body-lg leading-relaxed"
            >
              {t('talentPool.description')}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative z-10 shrink-0"
          >
            <Button
              className="bg-lima text-on-background px-8 py-4 font-black rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              {t('talentPool.ctaLabel')}
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}