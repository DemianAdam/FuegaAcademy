import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import type { CourseData } from '../../data/courses';

interface CourseSidebarProps {
  course: CourseData;
  formatType: 'live' | 'recorded';
  setFormatType: (format: 'live' | 'recorded') => void;
  selectedScheduleId: string;
  setSelectedScheduleId: (id: string) => void;
}

export function CourseSidebar({
  course,
  formatType,
  setFormatType,
  selectedScheduleId,
  setSelectedScheduleId,
}: CourseSidebarProps) {
  const { t } = useTranslation('course');

  return (
    <div className="sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-on-surface">{t('pricing.enrollment')}</span>
        <div className="flex gap-1 bg-surface p-1 rounded-lg border border-outline-variant">
          <Button
            variant={formatType === 'live' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFormatType('live')}
            className={formatType === 'live' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            {t('pricing.live')}
          </Button>
          <Button
            variant={formatType === 'recorded' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFormatType('recorded')}
            className={formatType === 'recorded' ? 'shadow-sm' : 'text-on-surface-variant'}
          >
            {t('pricing.recorded')}
          </Button>
        </div>
      </div>

      <div className="text-3xl font-black text-on-surface">
        {formatType === 'live' ? course.pricing.live.price : course.pricing.recorded.price}
        <span className="text-xs font-normal text-on-surface-variant ml-2">{t('pricing.singlePayment')}</span>
      </div>

      {formatType === 'live' && course.schedules && course.schedules.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {t('schedules.selectGroup')}
            </label>
            <span className="text-xs text-primary font-medium">{t('schedules.limitedSpots')}</span>
          </div>
          <div className="space-y-2.5">
            {course.schedules.map((sched) => {
              const isFull = sched.enrolledCount >= sched.capacity;
              const isSelected = selectedScheduleId === sched.id;

              return (
                <button
                  key={sched.id}
                  disabled={isFull}
                  onClick={() => setSelectedScheduleId(sched.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                    isFull
                      ? 'border-outline-variant bg-surface opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-sm'
                      : 'border-outline-variant hover:bg-surface text-on-surface-variant'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {sched.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isFull ? 'bg-error/10 text-error' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {isFull ? t('schedules.full') : t('schedules.spotsFree', { count: sched.capacity - sched.enrolledCount })}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sched.sessions.map((sess, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">event</span>
                        <span className="font-medium text-on-surface">{t(`days.${sess.day.toLowerCase()}`, { defaultValue: sess.day })}:</span>
                        <span>{sess.startTime} - {sess.endTime}hs</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <Button variant="primary" className="w-full py-4 font-bold text-base shadow-md">
          {t('enrollment.button')}
        </Button>
        <p className="text-center text-xs text-on-surface-variant">
          {t('enrollment.securePayment')}
        </p>
      </div>
    </div>
  );
}
