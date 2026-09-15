import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import type { StatData } from '../../data/stats';
import { stats } from '../../data/stats';

interface StatCardProps {
  stat: StatData;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn('bg-white rounded-2xl shadow-xl border border-outline-variant p-8 flex items-center gap-4')}
    >
      <div className={cn('bg-surface-container-low p-3 rounded-xl', stat.icon === stats[0].icon ? 'text-secondary' : stat.icon === stats[1].icon ? 'text-lima' : stat.icon === stats[2].icon ? 'text-secondary' : 'text-lima')}>
        <stat.icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div>
        <div className="text-2xl font-black text-on-surface">{stat.value}</div>
        <div className="text-xs text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function StatsBar() {
  const { t } = useTranslation('home');

  const translatedStats = stats.map((stat, index) => ({
    ...stat,
    label: t(`stats.${index === 0 ? 'students' : index === 1 ? 'rating' : index === 2 ? 'companies' : 'online'}`),
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative z-20 -mt-12 px-margin-desktop"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <h2 id="stats-heading" className="sr-only">{t('stats.heading')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {translatedStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}