import { useTranslation } from 'react-i18next';
import { CommunityFeedCard } from './CommunityFeedCard';
import type { CommunityPost } from '../../data/mockDashboardData';


interface CommunitySectionProps {
  post: CommunityPost;
}

export function CommunitySection({ post }: CommunitySectionProps) {
  const { t } = useTranslation('dashboard');

  return (
    <section>
      <h2 className="font-headline-lg text-[24px] mb-stack-md">{t('communitySection.title')}</h2>
      <CommunityFeedCard post={post} />
    </section>
  );
}
