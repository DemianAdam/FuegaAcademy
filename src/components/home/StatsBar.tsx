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
      /* p-3 sm:p-5 para ahorrar espacio, layout flex compacto */
      className={cn('bg-white rounded-2xl shadow-lg border border-outline-variant p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center text-center sm:text-left min-w-0')}
    >
      <div className={cn('p-2 sm:p-3 rounded-xl shrink-0 self-center sm:self-auto', stat.icon === stats[0].icon ? 'text-secondary' : stat.icon === stats[1].icon ? 'text-lima' : stat.icon === stats[2].icon ? 'text-secondary' : 'text-lima')}>
        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-base sm:text-2xl font-black text-on-surface truncate">{stat.value}</div>
        <div className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider leading-tight line-clamp-2">{stat.label}</div>
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
      className="relative z-20 -mt-12 px-4 md:px-margin-desktop"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto max-w-screen-2xl">
        <h2 id="stats-heading" className="sr-only">{t('stats.heading')}</h2>
        {/* grid-cols-2 forzado desde el inicio con un gap pequeño (gap-3) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {translatedStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}