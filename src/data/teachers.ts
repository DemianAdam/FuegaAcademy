export interface TeacherData {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  skills: string[];
  bio: string;
}

export const teachers: TeacherData[] = [
  {
    id: 'magali-valles',
    name: 'Magali Valles',
    title: 'Paid Media Senior',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgjwsARuQH9mHF5_DuicBFuneslReFmPrEllMsqqpk5q8Uw_I_3Vm5E3Xc6OjLfzQ022M1RS1evIj5gkS9FblZFRgSLnx0L7k6JqQW8t72mc4goOXyR4IOszZgayeoak5Pp9TcX7XNKpAGDOiUS_NJYIy2VWL2S8ZJ9RlUKcFsLG7BoiTzZOPsj9pW6ZZxpUWAb8j-atwrIu_zFZCQhA5PB53BQ1zPVWmciwY-HKMykvakqmEbA6evimNG6KMQC9WU-vr71g6SzI',
    skills: ['Google Ads', 'TikTok Ads'],
    bio: '+6 años de experiencia. USD 1M diarios administrados para marcas internacionales.',
  },
  {
    id: 'yago-balbi',
    name: 'Yago Balbi',
    title: 'Content Creator',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnk0L-RKVKfzvzAlR_8L5xNWnsuRUmiBcilugKygM4Pypzs-DPO7vWwQVlNMxNjAX3CTatBImlBY_JzBT8oHlHRCaJwzLWE23PCDjnrNPX1SWkvbbFXjHrUDrzOmzOVARfnEP69K3gmVbI2gjiWQwbZlOysCYC-Ymu-nh91Crb1GEX3jXxMNLxvFvIzpYIVDZO9jmrLZ432N8UePjHkKA2IZF_ddfjjOG7a2SkH0QLOdYXSudzSEiNmkxw7HYJUIx_Vf9sdFwKHg',
    skills: ['Adobe', 'Samsung'],
    bio: 'Creador de contenido para marcas globales con enfoque en storytelling visual.',
  },
  {
    id: 'martina-russo',
    name: 'Martina Russo',
    title: 'Editora Audiovisual',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
    skills: ['Netflix', 'HBO'],
    bio: '+8 años de experiencia en edición y postproducción de alto impacto comercial.',
  },
];