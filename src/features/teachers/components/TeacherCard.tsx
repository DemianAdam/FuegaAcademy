import { Avatar } from '@/components/ui/Avatar';

export interface TeacherCardData {
  slug: string;
  name: string;
  title: string;
  imageUrl: string;
  skills: string[];
  bio: string;
  quote?: string;
  stats?: Array<{ label: string; value: string }>;
}

interface TeacherCardProps {
  teacher: TeacherCardData;
  showQuote?: boolean;
  showStats?: boolean;
}

export function TeacherCard({ teacher, showQuote = false, showStats = false }: TeacherCardProps) {
  return (
    <div className="bg-white dark:bg-surface-container p-6 rounded-2xl border border-outline-variant flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-6 mb-6">
          <Avatar src={teacher.imageUrl} alt={teacher.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-on-surface truncate">{teacher.name}</h3>
            <p className="text-sm text-on-surface-variant mb-3">{teacher.title}</p>
            <div className="flex flex-wrap gap-2">
              {teacher.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-bold border px-2 rounded opacity-60 hover:opacity-100 hover:border-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{teacher.bio}</p>
      </div>
      {showQuote && teacher.quote && (
        <blockquote className="italic text-xs text-on-surface-variant border-l-2 border-primary pl-3 my-3">
          “{teacher.quote}”
        </blockquote>
      )}
      {showStats && teacher.stats && teacher.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-outline-variant/50">
          {teacher.stats.map((stat) => (
            <div key={`${stat.label}-${stat.value}`} className="text-center bg-surface-container-low p-2 rounded-lg">
              <div className="text-base font-bold text-primary">{stat.value}</div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

