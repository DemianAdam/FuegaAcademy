import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/Button';
import type { CourseWithRelations } from '@shared/validators/courses';

interface CourseSidebarProps {
  course: CourseWithRelations;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { t } = useTranslation('course');
  const navigate = useNavigate();
  const [formatType, setFormatType] = useState<'live' | 'recorded'>('live');

  const defaultScheduleId = course.schedules?.find(s => s.enrolledCount < s.capacity)?._id || course.schedules?.[0]?._id || '';
  const [selectedScheduleId, setSelectedScheduleId] = useState(defaultScheduleId);

  const enroll = useMutation(api.enrollments.mutations.enrollInCourse);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      await enroll({
        courseId: course._id,
        scheduleId: formatType === 'live' && (selectedScheduleId || defaultScheduleId) ? (selectedScheduleId || defaultScheduleId) : undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Error al inscribirse. Asegúrate de haber iniciado sesión.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const livePrice = course.pricing.live ? `$${course.pricing.live.amount}` : '$99';
  const recordedPrice = course.pricing.recorded ? `$${course.pricing.recorded.amount}` : '$49';

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
        {formatType === 'live' ? livePrice : recordedPrice}
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
              const activeScheduleId = selectedScheduleId || defaultScheduleId;
              const isSelected = activeScheduleId === sched._id;

              return (
                <button
                  key={sched._id}
                  disabled={isFull}
                  onClick={() => setSelectedScheduleId(sched._id)}
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
                        <span className="font-medium text-on-surface">{sess.day}:</span>
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
        <Button 
          variant="primary" 
          className="w-full py-4 font-bold text-base shadow-md"
          onClick={handleEnroll}
          disabled={isEnrolling}
        >
          {isEnrolling ? 'Inscribiendo...' : t('enrollment.button')}
        </Button>
        <p className="text-center text-xs text-on-surface-variant">
          {t('enrollment.securePayment')}
        </p>
      </div>
    </div>
  );
}
