import { Search, PlayCircle, Rocket } from 'lucide-react';

export interface StepData {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconBg: 'lavanda' | 'lima';
}

export const steps: StepData[] = [
  {
    number: 1,
    icon: Search,
    title: 'Elegí tu curso',
    description: 'Explorá los cursos y elegí el que mejor se adapte a tus objetivos.',
    iconBg: 'lavanda',
  },
  {
    number: 2,
    icon: PlayCircle,
    title: 'Aprendé a tu ritmo',
    description: 'Accedé a clases en vivo y grabadas, materiales y comunidad exclusiva.',
    iconBg: 'lima',
  },
  {
    number: 3,
    icon: Rocket,
    title: 'Aplicá y crecé',
    description: 'Implementá lo aprendido, conseguí clientes y trabajá desde donde quieras.',
    iconBg: 'lavanda',
  },
];