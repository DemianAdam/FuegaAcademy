import { useTranslation } from 'react-i18next';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';
import type { TeacherData } from '../../data/teachers';

interface TeacherCardProps {
  teacher: TeacherData;
  showQuote?: boolean;
  showStats?: boolean;
}

export function TeacherCard({ teacher, showQuote = false, showStats = false }: TeacherCardProps) {
  const { t } = useTranslation('home');

  return (
    <div className={cn('bg-white p-6 rounded-2xl border border-outline-variant flex flex-col justify-between')}>
      <div>
        <div className="flex items-start gap-6 mb-6">
          <Avatar src={teacher.imageUrl} alt={teacher.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-on-surface truncate">{teacher.name}</h3>
            <p className="text-sm text-on-surface-variant mb-3">
              {t(`teachers.items.${teacher.id}.role`, { defaultValue: teacher.title })}
            </p>
            <div className="flex flex-wrap gap-2">
              {teacher.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    'text-[10px] font-bold border px-2 rounded transition-all',
                    'opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:border-primary'
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          {t(`teachers.items.${teacher.id}.description`, { defaultValue: teacher.bio })}
        </p>
      </div>

      {showQuote && teacher.quote && (
        <blockquote className="italic text-xs text-on-surface-variant border-l-2 border-primary pl-3 my-3">
          "{teacher.quote}"
        </blockquote>
      )}

      {showStats && teacher.stats && teacher.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-outline-variant/50">
          {teacher.stats.map((stat, idx) => (
            <div key={idx} className="text-center bg-surface-container-low p-2 rounded-lg">
              <div className="text-base font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
