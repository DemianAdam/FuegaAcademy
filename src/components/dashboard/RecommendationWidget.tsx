import { Trans } from 'react-i18next';

export function RecommendationWidget() {
  return (
    <div className="bg-surface-container-lowest p-stack-md pb-8 polaroid-frame relative rotate-1 transition-all hover:rotate-0">
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-3.75 bg-[rgba(198,183,255,0.4)] z-10"></div>
      <div className="w-full aspect-square mb-4 bg-surface-dim overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt="Lifestyle"
          src="https://lh3.googleusercontent.com/aida/AP1WRLsNxAt-7TXrA112Zne6xT1keR7k_GpaAkCqW2rrYpFqXiQfGYxb0gVZOZfC2rwV-bWtqB26GHysdQWxmfy71tSYbTEoRIpuNo6ZSxwV3IBFrMVgKMtZmWMFZQqWlLv0uty4geCG71ldsV9OIBJ-pBC5_sub8pIyN0WYd0kPU52S1uQG7IfKKLhrBFkmMN2Uig2s_jY1UoSdljNm7VxWOqkjGbW3ulhQaTkfsgz6PvYnzsQ9C3ASSJFBm1o"
        />
      </div>
      <span className="font-['Bricolage_Grotesque'] text-[20px] leading-[1.2] text-on-surface block text-center mt-2 transform -rotate-2">
        <Trans i18nKey="recommendation.quote" ns="dashboard">
          Tu próxima versión <br /> <span className="bg-[#ccff00] px-1.5 py-0.5 italic">empieza hoy.</span>
        </Trans>
      </span>
    </div>
  );
}
