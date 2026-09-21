export interface UserProfile {
  _id: string;
  _creationTime: number;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface InProgressCourse {
  _id: string;
  _creationTime: number;
  title: string;
  category: string;
  progressPercent: number;
  completedClasses: number;
  totalClasses: number;
  imageUrl: string;
}

export interface CommunityPost {
  _id: string;
  _creationTime: number;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  likesCount: number;
  commentsCount: number;
}

export interface LiveClass {
  _id: string;
  _creationTime: number;
  title: string;
  scheduleText: string;
}

export interface UserActivity {
  streakDays: number;
  skillsEarned: number;
}

export const mockDashboardData = {
  user: {
    _id: "user_01",
    _creationTime: Date.now(),
    name: "Martín Beltrini",
    role: "Creador Digital",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJLbDXdoUDN_95Gnegm0yP9NCGhPmaMPyFHWORwXvdGB44vnxMp7lJmP58-v1rLBjP6keG19BBoZpHGm-QTj2oQp6ZLNP0Yel6iVYV7dT-P4XEzpP6yF3bgZbUycdID2nosqOV03XtTFEBGxjtYFzGtx3WgBrBFZOpdSPcJgRUjHWCHt-92-54tZM_CvpjQi2044mo2h4StXQqoRu9yoUQacdziZ_oS7txin_QKRneRJqV5mjO1SHfs4NE6OQgNCAO7WNy7-2LtJo",
  } as UserProfile,
  courses: [
    {
      _id: "course_01",
      _creationTime: Date.now(),
      title: "Edición Pro para Contenido Vertical",
      category: "CREATOR ECONOMY",
      progressPercent: 65,
      completedClasses: 12,
      totalClasses: 18,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4XBVahKfFzjA_46sy47aZH7tW-i6pJI5zMDRE2r08RWnP4H7Ber399q1Gg2JNivs8mD__Wa08nQFqFwegKc_7GpTFqUJnKjaFPfwfEWuLHlBYtozIkD8aiaZnwgHDaVXpEWd1pbrehApRmEZSGZW74C3B0ZO1ql-3vZH7HBbjr93v3aXN7iXz7HoUmfb3afyLgK4W0lyi8r_s_K610sAHQZEpxatdZlcGI-JNQTkWgVe5I1iF95-3hIrmO-RATuVSb0PlZwp65EI",
    },
    {
      _id: "course_02",
      _creationTime: Date.now(),
      title: "Inglés para Marketers",
      category: "MARKETING",
      progressPercent: 30,
      completedClasses: 4,
      totalClasses: 12,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA44JvxIWsJRLbJ8vM1UkWuupbZ2WcAEHCtSZRNKdE3wWR7rkmuYmx31SAegaVm75k3cskKkzyIth-DvZCX-SDXy-N0mF5543t5QHt7evfxCu13IMkwxNyMrSycqcLt5O5YPOIaL3l8p7ue9-cnJkUeCq2UH4juFp29ItFO4ctr9CNeaxo30wW_20vls20jWpzFl9N52_iSahJpzSzfXq0tcJEay2ng_j8lE0ugkQrG-nRuD-cVV0NIuCe3pb_Ch74jGljgsdDg6A",
    },
  ] as InProgressCourse[],
  communityPost: {
    _id: "post_01",
    _creationTime: Date.now(),
    authorName: "Sofía García",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1E8V1JWtBAeGNOdcxZ81UIw_KyWbcc1h9UyILKZjvny3ma7nQC8T2k_TiCkWNBhW0GREM92sF44AF-i9mWShMJpt2Eo0NHdMypKKRc_Pef-9z59iM29LH-jPGEaZqMn8ykQZqAIwo4FuqNHfRd7DjejVzYyXdNd6crQrQK8u90PGd9TZpeXfZFPQjKTbmKlI4kKUPQ7nYPyk5oWSfebmuRv5D0OVaRVPDsco1box0lK-JjN5EdSnTNLYcDvthnCGs8xaCWNEZ8s0",
    timeAgo: "Hace 2 horas",
    content: "¡Acabo de conseguir mi primer cliente de edición gracias a lo que aprendí en el módulo 4! La clave fue el tip de cómo presentar el portfolio. ¡Vamos que se puede!",
    likesCount: 24,
    commentsCount: 8,
  } as CommunityPost,
  liveClass: {
    _id: "live_01",
    _creationTime: Date.now(),
    title: "Q&A con Mentores: Monetización",
    scheduleText: "Hoy a las 19:00 HS (GMT-3). Prepará tus dudas sobre presupuestos.",
  } as LiveClass,
  activity: {
    streakDays: 5,
    skillsEarned: 3,
  } as UserActivity,
};
