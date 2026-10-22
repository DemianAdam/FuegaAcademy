import { internalMutation } from '../_generated/server';

const teachers = [{ slug: 'magali-valles', name: 'Magali Valles', title: 'Paid Media Senior', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', skills: ['Google Ads', 'TikTok Ads'], bio: 'Paid media specialist with more than six years of experience managing international campaigns.', quote: 'Paid media turns qualified attention into measurable growth.', stats: [{ label: 'Students trained', value: '1,200+' }] }, { slug: 'yago-balbi', name: 'Yago Balbi', title: 'Content Creator', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', skills: ['Storytelling', 'Video editing'], bio: 'Content creator focused on visual storytelling for global brands.', quote: 'The first three seconds earn the audience attention.', stats: [{ label: 'Views generated', value: '100M+' }] }] as const;

export const seedTeachers = internalMutation({ args: {}, handler: async (ctx) => {
  for (const teacher of teachers) {
    const existing = await ctx.db.query('teachers').withIndex('by_slug', (query) => query.eq('slug', teacher.slug)).unique();
    if (existing) await ctx.db.patch(existing._id, { ...teacher, stats: [...teacher.stats], skills: [...teacher.skills], status: 'published' });
    else await ctx.db.insert('teachers', { ...teacher, stats: [...teacher.stats], skills: [...teacher.skills], status: 'published' });
  }
  return { success: true, count: teachers.length };
} });
