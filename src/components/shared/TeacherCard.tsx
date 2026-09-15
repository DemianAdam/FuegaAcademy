import { Avatar } from '../ui/Avatar';
import { cn } from '../../lib/utils';
import type { TeacherData } from '../../data/teachers';

interface TeacherCardProps {
  teacher: TeacherData;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className={cn('bg-white p-6 rounded-2xl border border-outline-variant')}>
      <div className="flex items-start gap-6 mb-6">
        <Avatar src={teacher.imageUrl} alt={teacher.name} size="md" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-on-surface">{teacher.name}</h3>
          <p className="text-sm text-on-surface-variant mb-3">{teacher.title}</p>
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
      <p className="text-sm text-on-surface-variant leading-relaxed">{teacher.bio}</p>
    </div>
  );
}