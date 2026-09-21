import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CommunityPost } from '../../data/mockDashboardData';

interface CommunityFeedCardProps {
  post: CommunityPost;
}

export function CommunityFeedCard({ post }: CommunityFeedCardProps) {
  const { t } = useTranslation('dashboard');
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="bg-surface-container-high p-stack-lg rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[128px] text-primary">diversity_3</span>
      </div>
      <div className="flex gap-4 items-start relative z-10">
        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shrink-0">
          <img
            className="w-full h-full object-cover"
            alt={post.authorName}
            src={post.authorAvatar}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{post.authorName}</span>
            <span className="text-xs text-on-surface-variant bg-surface-bright px-2 py-0.5 rounded-full">
              {t('communitySection.timeAgo')}
            </span>
          </div>
          <p className="text-on-surface font-body-md mb-4">&quot;{t('communitySection.postContent')}&quot;</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-error font-bold' : 'text-on-surface-variant hover:text-primary'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              {likes}
            </button>
            <button
              className="flex items-center gap-1 text-on-surface-variant text-sm hover:text-primary transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              {t('communitySection.comments', { count: post.commentsCount })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
