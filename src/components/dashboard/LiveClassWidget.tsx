import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LiveClass } from '../../data/mockDashboardData';

interface LiveClassWidgetProps {
  liveClass: LiveClass;
}

export function LiveClassWidget({}: LiveClassWidgetProps) {
  const { t } = useTranslation('dashboard');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined(true);
  };

  return (
    <div className="bg-inverse-surface text-inverse-on-surface p-stack-lg rounded-xl relative overflow-hidden group">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-fixed/20 rounded-full blur-2xl group-hover:bg-primary-fixed/30 transition-all pointer-events-none"></div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
        <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed">{t('liveClass.badge')}</span>
      </div>
      <h3 className="font-headline-lg text-[22px] mb-2">{t('liveClass.title')}</h3>
      <p className="text-surface-dim mb-6 text-sm">{t('liveClass.schedule')}</p>
      <button
        onClick={handleJoin}
        className="w-full py-3 bg-primary-fixed text-on-primary-fixed font-bold rounded-lg flex items-center justify-center gap-2 transform transition-transform hover:scale-[1.02] active:scale-95"
        type="button"
      >
        <span className="material-symbols-outlined">videocam</span>
        {joined ? t('liveClass.joined') : t('liveClass.join')}
      </button>
    </div>
  );
}
