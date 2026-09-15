import {
  HeroSection,
  StatsBar,
  CoursesSection,
  TalentPoolSection,
  TeachersSection,
  TestimonialsSection,
  HowItWorksSection,
  CTAFooterSection,
} from '../components/home';

export function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CoursesSection />
      <TalentPoolSection />
      <TeachersSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <CTAFooterSection />
    </>
  );
}