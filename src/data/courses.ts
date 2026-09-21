export interface CourseModule {
  id: string;
  title: string;
  items: string[];
}

export interface CourseAchievement {
  icon: string;
  text: string;
  bold?: boolean;
}

export interface CourseSidebarItem {
  label: string;
  value: string;
}

export interface CourseMentor {
  name: string;
  title: string;
  bio: string;
  quote: string;
  image: string;
  stats: { label: string; value: string }[];
}

export interface CourseStat {
  icon: string;
  value: string;
  label: string;
}

export interface CoursePricing {
  live: { label: string; price: string };
  recorded: { label: string; price: string };
}

export interface CourseScheduleSession {
  day: string;
  startTime: string;
  endTime: string;
}

export interface CourseScheduleOption {
  id: string;
  name: string;
  sessions: CourseScheduleSession[];
  capacity: number;
  enrolledCount: number;
}

export interface CourseData {
  id: string;
  title: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  heroImage: string;
  polaroidImage: string;
  polaroidCaption: string;
  badge: 'most-chosen' | 'new' | 'popular';
  duration: string;
  format: string;
  modules: CourseModule[];
  achievements: CourseAchievement[];
  sidebar: CourseSidebarItem[];
  mentor: CourseMentor;
  stats: CourseStat[];
  pricing: CoursePricing;
  schedules: CourseScheduleOption[];
}

export const courses: CourseData[] = [
  {
    id: 'ugc-creator',
    title: 'Content UGC Creator',
    titleHighlight: 'UGC Creator',
    description: 'Convertite en el puente entre las marcas y su audiencia. Trabajá de forma independiente, creá contenido auténtico y viví la libertad de colaborar con marcas de todo el mundo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgjwsARuQH9mHF5_DuicBFuneslReFmPrEllMsqqpk5q8Uw_I_3Vm5E3Xc6OjLfzQ022M1RS1evIj5gkS9FblZFRgSLnx0L7k6JqQW8t72mc4goOXyR4IOszZgayeoak5Pp9TcX7XNKpAGDOiUS_NJYIy2VWL2S8ZJ9RlUKcFsLG7BoiTzZOPsj9pW6ZZxpUWAb8j-atwrIu_zFZCQhA5PB53BQ1zPVWmciwY-HKMykvakqmEbA6evimNG6KMQC9WU-vr71g6SzI',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJuJ-1EzHECxoa-4tZij2W2lYk0vhlz4_g8QEMQPrzl-XaC0oMpdvgVIPSAUCelVpCT-qSTm2wjDaqaCIA2QPBbJhjry_ms6b1fgQimg9AOnr1cyDTFeHWalfNC55Tn4HC2K2tc-UmxaOhKsSeaIrHmB9cXqEEYw4drzsRdWeTNHIGPBM9ayERmucLKsld3unBKxYsy-Hyg4OeBxICaCaIcHXuUCTbu_emIFodsJ0mw8Qp7xcNhFCx',
    polaroidImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2oEFj8RWrnboHyk1eh_NwJUGnCX1Xv8bzRLWQ-3WsCns1nKgSqS2la85qKitF5_Apdom2kylGAIKn0HXFNf7W9zYZReGpiHdGZKmO3U65s8BUGa9XQe_zm_rXiR9d9C7lz7NleK0X-ItA_o3fpwbCdTvTUuEHnc-DpsXZ7au9MoMfpaT8EI1ynF1DhVsJ_aIU-laQzx63twb4O07XO9SGluuFSRguBcPzlABK2hiYO-Kyk8OKJLGZYLxrb8GWuJKCtg',
    polaroidCaption: 'Tu futura oficina...',
    badge: 'most-chosen',
    duration: '8 Semanas',
    format: 'En vivo + Grabado',
    modules: [
      {
        id: 'module-1',
        title: 'Módulo 1: Introducción al mundo UGC',
        items: [
          'Qué es un UGC Creator, Diferencias con Influencers, Qué buscan las marcas, Proceso de ingreso a la Bolsa de Trabajo'
        ]
      },
      {
        id: 'module-2',
        title: 'Módulo 2: Cómo crear contenido que vende',
        items: [
          'Producción con celular, Hooks, Storytelling, Iluminación y Audio, Errores comunes'
        ]
      },
      {
        id: 'module-3',
        title: 'Módulo 3: Simulación de campañas reales',
        items: [
          'Trabajo con briefs reales, correcciones personalizadas, feedback de Fuega Studio'
        ]
      },
      {
        id: 'module-4',
        title: 'Módulo 4: Tu Portfolio como UGC Creator',
        items: [
          'Construcción del portfolio para evaluación, cómo presentar trabajos, video de presentación'
        ]
      },
      {
        id: 'module-5',
        title: 'Módulo 5: Evaluación Final',
        items: [
          'Desarrollo de campaña para cliente real. Los alumnos que aprueben ingresan a la Bolsa de Creadores de Fuega Studio'
        ]
      }
    ],
    achievements: [
      { icon: 'star_rate', text: 'Construir una marca personal que atraiga clientes ideales.' },
      { icon: 'star_rate', text: 'Dominar la edición de video para redes sociales de alto impacto.' },
      { icon: 'star_rate', text: 'Sistemas de gestión de clientes y productividad creadora.' },
      { icon: 'workspace_premium', text: 'Bolsa de Creadores: Al finalizar, unite a nuestro pool de talentos exclusivo para trabajar directamente con nosotros y marcas globales.', bold: true }
    ],
    sidebar: [
      { label: 'Tipo', value: 'Vivo + Grabado' },
      { label: 'Acceso', value: 'De por vida' },
      { label: 'Duración', value: '8 Semanas' },
      { label: 'Clases', value: 'Martes y Jueves' }
    ],
    mentor: {
      name: 'Martina Beltrini',
      title: 'Fundadora de Fuega Academy',
      bio: 'Fundadora de Fuega Academy, Martina ha ayudado a más de 3,000 creativos a digitalizar sus habilidades. Su enfoque es 100% práctico y orientado a resultados reales, sin rodeos ni teoría innecesaria.',
      quote: 'Aprendé de alguien que ya recorrió el camino.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjwdopVldJnHyhdfmgXpXEcpYNXJFsG04NknT5svuy_WbiwtnVluyESd8I11bRsABixpkAcMF2yKAuMXgecwJGyRoQmAj0IoAFSNF9h0n_GeFsLU0X9xLQQzM6afLsip-xn0J4lfQk_0g2Rwz_m5CRmqjTlngHrbBLhGii74q2RPfMA16PqKNYejBIunx13cUBcqCb4NhR687BTS5bPKQn6MNJdkY9q7cPo_SOqQ15LmgB8k98rSf8YHTMeibAHMyaUZdra44c-M',
      stats: [
        { label: 'Años Exp.', value: '10+' },
        { label: 'Alumnos', value: '3k' }
      ]
    },
    stats: [
      { icon: 'groups', value: '+3000', label: 'ALUMNOS ACTIVOS' },
      { icon: 'public', value: '12', label: 'PAÍSES' },
      { icon: 'verified', value: '100%', label: 'SATISFACCIÓN' },
      { icon: 'all_inclusive', value: '∞', label: 'ACCESO' }
    ],
    pricing: {
      live: { label: 'Vivo', price: '$100.000 ARS' },
      recorded: { label: 'Grabado', price: '$80.000 ARS' }
    },
    schedules: [
      {
        id: 'sched-1',
        name: 'Grupo Mañana',
        sessions: [
          { day: 'Lunes', startTime: '09:00', endTime: '11:00' },
          { day: 'Jueves', startTime: '13:00', endTime: '15:00' }
        ],
        capacity: 20,
        enrolledCount: 14
      },
      {
        id: 'sched-2',
        name: 'Grupo Noche',
        sessions: [
          { day: 'Lunes', startTime: '21:00', endTime: '23:00' },
          { day: 'Jueves', startTime: '21:00', endTime: '23:00' }
        ],
        capacity: 20,
        enrolledCount: 20 // Full / sold out
      },
      {
        id: 'sched-3',
        name: 'Grupo Fin de Semana',
        sessions: [
          { day: 'Miércoles', startTime: '09:00', endTime: '11:00' },
          { day: 'Viernes', startTime: '15:00', endTime: '17:00' }
        ],
        capacity: 15,
        enrolledCount: 8
      }
    ]
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    titleHighlight: 'Video Editing',
    description: 'Dominá la edición de videos para redes sociales y campañas. Aprendé técnicas profesionales de edición, storytelling visual y post-producción para crear contenido que enganche y convierta.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXDeyiH-fqrJ5u69YDmAJ-aZaAE7QeRkuEfwSHMV5CyAOtYLFh0HMLxDWBTiRJz8ksl4EKkDueioJ3xJJUwmBGg00wbkubapQ4nX6O16qU7EsONk6OmTgZ8LMolbN4PQ8Iy-UKa4TD6nnXDahjFz0L44SCmdTRvxSfPUHowjSwlfwmLiebPCVsjYggqK7ZASDy18Ith_Xmw5wQrjE_G-a0JKgbhqwZIjlOusuIR_rHcAUYap9V4jlhCplNsJuORpWnVY3LWHdBfk',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXDeyiH-fqrJ5u69YDmAJ-aZaAE7QeRkuEfwSHMV5CyAOtYLFh0HMLxDWBTiRJz8ksl4EKkDueioJ3xJJUwmBGg00wbkubapQ4nX6O16qU7EsONk6OmTgZ8LMolbN4PQ8Iy-UKa4TD6nnXDahjFz0L44SCmdTRvxSfPUHowjSwlfwmLiebPCVsjYggqK7ZASDy18Ith_Xmw5wQrjE_G-a0JKgbhqwZIjlOusuIR_rHcAUYap9V4jlhCplNsJuORpWnVY3LWHdBfk',
    polaroidImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRXDeyiH-fqrJ5u69YDmAJ-aZaAE7QeRkuEfwSHMV5CyAOtYLFh0HMLxDWBTiRJz8ksl4EKkDueioJ3xJJUwmBGg00wbkubapQ4nX6O16qU7EsONk6OmTgZ8LMolbN4PQ8Iy-UKa4TD6nnXDahjFz0L44SCmdTRvxSfPUHowjSwlfwmLiebPCVsjYggqK7ZASDy18Ith_Xmw5wQrjE_G-a0JKgbhqwZIjlOusuIR_rHcAUYap9V4jlhCplNsZip-xn0J4lfQk_0g2Rwz_m5CRmqjTlngHrbBLhGii74q2RPfMA16PqKNYejBIunx13cUBcqCb4NhR687BTS5bPKQn6MNJdkY9q7cPo_SOqQ15LmgB8k98rSf8YHTMeibAHMyaUZdra44c-M',
    polaroidCaption: 'Tu estudio de edición...',
    badge: 'new',
    duration: '5 semanas',
    format: 'En vivo + Grabado',
    modules: [
      {
        id: 'module-1',
        title: 'Módulo 1: Fundamentos de edición',
        items: [
          'Interfaces y herramientas, Atajos esenciales, Organización de proyectos, Formatos y codecs'
        ]
      },
      {
        id: 'module-2',
        title: 'Módulo 2: Storytelling visual',
        items: [
          'Ritmo y pacing, Transiciones efectivas, Música y sound design, Color grading básico'
        ]
      },
      {
        id: 'module-3',
        title: 'Módulo 3: Edición para redes sociales',
        items: [
          'Formatos verticales, Hooks de retención, Subtítulos dinámicos, Exportación optimizada'
        ]
      },
      {
        id: 'module-4',
        title: 'Módulo 4: Post-producción avanzada',
        items: [
          'Motion graphics básicos, Tracking y estabilización, Efectos visuales, Mastering final'
        ]
      }
    ],
    achievements: [
      { icon: 'star_rate', text: 'Dominar la edición profesional con DaVinci Resolve y Premiere.' },
      { icon: 'star_rate', text: 'Crear narrativas visuales que enganchen desde el primer segundo.' },
      { icon: 'star_rate', text: 'Optimizar tu flujo de trabajo para entregas rápidas y de calidad.' },
      { icon: 'workspace_premium', text: 'Acceso a la Bolsa de Creadores para proyectos de edición freelance.', bold: true }
    ],
    sidebar: [
      { label: 'Tipo', value: 'Vivo + Grabado' },
      { label: 'Acceso', value: 'De por vida' },
      { label: 'Duración', value: '5 Semanas' },
      { label: 'Clases', value: 'Martes y Jueves' }
    ],
    mentor: {
      name: 'Martina Beltrini',
      title: 'Fundadora de Fuega Academy',
      bio: 'Fundadora de Fuega Academy, Martina ha ayudado a más de 3,000 creativos a digitalizar sus habilidades. Su enfoque es 100% práctico y orientado a resultados reales, sin rodeos ni teoría innecesaria.',
      quote: 'Aprendé de alguien que ya recorrió el camino.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjwdopVldJnHyhdfmgXpXEcpYNXJFsG04NknT5svuy_WbiwtnVluyESd8I11bRsABixpkAcMF2yKAuMXgecwJGyRoQmAj0IoAFSNF9h0n_GeFsLU0X9xLQQzM6afLsip-xn0J4lfQk_0g2Rwz_m5CRmqjTlngHrbBLhGii74q2RPfMA16PqKNYejBIunx13cUBcqCb4NhR687BTS5bPKQn6MNJdkY9q7cPo_SOqQ15LmgB8k98rSf8YHTMeibAHMyaUZdra44c-M',
      stats: [
        { label: 'Años Exp.', value: '10+' },
        { label: 'Alumnos', value: '3k' }
      ]
    },
    stats: [
      { icon: 'groups', value: '+3000', label: 'ALUMNOS ACTIVOS' },
      { icon: 'public', value: '12', label: 'PAÍSES' },
      { icon: 'verified', value: '100%', label: 'SATISFACCIÓN' },
      { icon: 'all_inclusive', value: '∞', label: 'ACCESO' }
    ],
    pricing: {
      live: { label: 'Vivo', price: '$90.000 ARS' },
      recorded: { label: 'Grabado', price: '$70.000 ARS' }
    },
    schedules: [
      {
        id: 'sched-ed-1',
        name: 'Grupo Intensivo',
        sessions: [
          { day: 'Martes', startTime: '10:00', endTime: '12:00' },
          { day: 'Jueves', startTime: '15:00', endTime: '17:00' }
        ],
        capacity: 15,
        enrolledCount: 5
      }
    ]
  },
  {
    id: 'global-marketing',
    title: 'Global Marketing',
    titleHighlight: 'Global Marketing',
    description: 'Aprendé a diseñar estrategias de marketing digital para escalar productos y servicios a nivel internacional. Domina embudos de conversión, pauta publicitaria y growth hacking.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
    polaroidImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
    polaroidCaption: 'Tu pasaporte global...',
    badge: 'popular',
    duration: '6 semanas',
    format: 'En vivo + Grabado',
    modules: [
      {
        id: 'module-1',
        title: 'Módulo 1: Fundamentos de Growth Marketing',
        items: ['Embudo de conversión, Métricas clave (CAC, LTV, ROI), Psicología del consumidor']
      },
      {
        id: 'module-2',
        title: 'Módulo 2: Paid Media avanzado',
        items: ['Meta Ads, Google Ads, Optimización de campañas globales, Testing de creativos']
      }
    ],
    achievements: [
      { icon: 'star_rate', text: 'Diseñar estrategias de marketing escalables a nivel internacional.' },
      { icon: 'star_rate', text: 'Gestionar presupuestos publicitarios con alto retorno de inversión.' }
    ],
    sidebar: [
      { label: 'Tipo', value: 'Vivo + Grabado' },
      { label: 'Acceso', value: 'De por vida' },
      { label: 'Duración', value: '6 Semanas' },
      { label: 'Clases', value: 'Miércoles y Viernes' }
    ],
    mentor: {
      name: 'Martina Beltrini',
      title: 'Fundadora de Fuega Academy',
      bio: 'Fundadora de Fuega Academy, Martina ha ayudado a más de 3,000 creativos a digitalizar sus habilidades.',
      quote: 'El marketing efectivo conecta personas con soluciones reales.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjwdopVldJnHyhdfmgXpXEcpYNXJFsG04NknT5svuy_WbiwtnVluyESd8I11bRsABixpkAcMF2yKAuMXgecwJGyRoQmAj0IoAFSNF9h0n_GeFsLU0X9xLQQzM6afLsip-xn0J4lfQk_0g2Rwz_m5CRmqjTlngHrbBLhGii74q2RPfMA16PqKNYejBIunx13cUBcqCb4NhR687BTS5bPKQn6MNJdkY9q7cPo_SOqQ15LmgB8k98rSf8YHTMeibAHMyaUZdra44c-M',
      stats: [
        { label: 'Años Exp.', value: '10+' },
        { label: 'Alumnos', value: '3k' }
      ]
    },
    stats: [
      { icon: 'groups', value: '+3000', label: 'ALUMNOS ACTIVOS' },
      { icon: 'public', value: '12', label: 'PAÍSES' },
      { icon: 'verified', value: '100%', label: 'SATISFACCIÓN' },
      { icon: 'all_inclusive', value: '∞', label: 'ACCESO' }
    ],
    pricing: {
      live: { label: 'Vivo', price: '$120.000 ARS' },
      recorded: { label: 'Grabado', price: '$95.000 ARS' }
    },
    schedules: [
      {
        id: 'sched-mkt-1',
        name: 'Grupo Global',
        sessions: [
          { day: 'Miércoles', startTime: '18:00', endTime: '20:00' },
          { day: 'Viernes', startTime: '18:00', endTime: '20:00' }
        ],
        capacity: 20,
        enrolledCount: 19 // Almost full
      }
    ]
  }
];
