import { useTranslation } from 'react-i18next';
import type { UserActivity } from '../../data/mockDashboardData';

interface ActivityStatsWidgetProps {
  activity: UserActivity;
}

export function ActivityStatsWidget({ activity }: ActivityStatsWidgetProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="bg-secondary-container/20 p-stack-md rounded-xl border border-secondary-container/30">
      <h4 className="font-bold text-sm mb-4 text-on-secondary-container flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">analytics</span>
        {t('activityStats.title')}
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-on-surface-variant">{t('activityStats.streak')}</span>
          <span className="font-bold text-secondary">{t('activityStats.streakValue', { days: activity.streakDays })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-on-surface-variant">{t('activityStats.skills')}</span>
          <span className="font-bold text-secondary">{activity.skillsEarned}</span>
        </div>
      </div>
    </div>
  );
}
