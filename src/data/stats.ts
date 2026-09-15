import { Users, Star, Building, Globe } from 'lucide-react';

export interface StatData {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

export const stats: StatData[] = [
  { icon: Users, value: '+3.000', label: 'alumnos en toda la comunidad' },
  { icon: Star, value: '4,9/5', label: 'calificación promedio' },
  { icon: Building, value: '+50', label: 'empresas contrataron alumnos' },
  { icon: Globe, value: '100%', label: 'online y desde cualquier lugar' },
];