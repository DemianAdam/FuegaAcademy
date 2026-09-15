export interface CourseData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: 'most-chosen' | 'new' | 'popular';
  duration: string;
  format: string;
}

export const courses: CourseData[] = [
  {
    id: 'ugc-creator',
    title: 'Content UGC Creator',
    description: 'Aprendé a crear contenido que conecta y convierte para marcas reales.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgjwsARuQH9mHF5_DuicBFuneslReFmPrEllMsqqpk5q8Uw_I_3Vm5E3Xc6OjLfzQ022M1RS1evIj5gkS9FblZFRgSLnx0L7k6JqQW8t72mc4goOXyR4IOszZgayeoak5Pp9TcX7XNKpAGDOiUS_NJYIy2VWL2S8ZJ9RlUKcFsLG7BoiTzZOPsj9pW6ZZxpUWAb8j-atwrIu_zFZCQhA5PB53BQ1zPVWmciwY-HKMykvakqmEbA6evimNG6KMQC9WU-vr71g6SzI',
    badge: 'most-chosen',
    duration: '4 semanas',
    format: 'En vivo + Grabado',
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Dominá la edición de videos para redes sociales y campañas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXDeyiH-fqrJ5u69YDmAJ-aZaAE7QeRkuEfwSHMV5CyAOtYLFh0HMLxDWBTiRJz8ksl4EKkDueioJ3xJJUwmBGg00wbkubapQ4nX6O16qU7EsONk6OmTgZ8LMolbN4PQ8Iy-UKa4TD6nnXDahjFz0L44SCmdTRvxSfPUHowjSwlfwmLiebPCVsjYggqK7ZASDy18Ith_Xmw5wQrjE_G-a0JKgbhqwZIjlOusuIR_rHcAUYap9V4jlhCplNsJuORpWnVY3LWHdBfk',
    badge: 'new',
    duration: '5 semanas',
    format: 'En vivo + Grabado',
  },
  {
    id: 'languages',
    title: 'Idiomas para Marketers',
    description: 'Inglés, italiano y japonés enfocado en marketing y negocios.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
    badge: 'popular',
    duration: '8 semanas',
    format: 'En vivo + Grabado',
  },
];