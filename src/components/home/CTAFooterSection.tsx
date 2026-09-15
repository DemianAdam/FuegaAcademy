import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Avatar, AvatarStack } from '../ui/Avatar';
import { ArrowRight } from 'lucide-react';

export function CTAFooterSection() {
  const { t } = useTranslation('home');

  const avatarImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgjwsARuQH9mHF5_DuicBFuneslReFmPrEllMsqqpk5q8Uw_I_3Vm5E3Xc6OjLfzQ022M1RS1evIj5gkS9FblZFRgSLnx0L7k6JqQW8t72mc4goOXyR4IOszZgayeoak5Pp9TcX7XNKpAGDOiUS_NJYIy2VWL2S8ZJ9RlUKcFsLG7BoiTzZOPsj9pW6ZZxpUWAb8j-atwrIu_zFZCQhA5PB53BQ1zPVWmciwY-HKMykvakqmEbA6evimNG6KMQC9WU-vr71g6SzI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBsnk0L-RKVKfzvzAlR_8L5xNWnsuRUmiBcilugKygM4Pypzs-DPO7vWwQVlNMxNjAX3CTatBImlBY_JzBT8oHlHRCaJwzLWE23PCDjnrNPX1SWkvbbFXjHrUDrzOmzOVARfnEP69K3gmVbI2gjiWQwbZlOysCYC-Ymu-nh91Crb1GEX3jXxMNLxvFvIzpYIVDZO9jmrLZ432N8UePjHkKA2IZF_ddfjjOG7a2SkH0QLOdYXSudzSEiNmkxw7HYJUIx_Vf9sdFwKHg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDVV68iK55jCbEMygH1Rra3y4mztWrwLPAOi2cPDQweQ3tiTcKgvEOITR9Y015MIjpre-T6QOYUO2hO6n7tJ2lLgsF59PiDj-Wc6WDCzeFqUir_m1A3gzFZUv_0plaFyEYtCjlTZzLpSRWeXQw5xal0bb9O3Lw4xxswl2_3Tg5wvHLA2l9HLgjXkmsh0P5ldxW2oUwgp6AzsgSgfCMaNshmUHBUY-MBnfCtRe5bLtJX5rK5jwnc64wLtyDnxI1G8ViecfowImt2CGQ',
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="bg-on-background py-24 px-margin-desktop relative overflow-hidden"
      aria-labelledby="cta-footer-heading"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lima via-transparent to-transparent" aria-hidden="true" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lima font-bold text-xs uppercase tracking-widest mb-4"
          >
            {t('ctaFooter.tag')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="cta-footer-heading"
            className="text-white font-display-lg text-4xl md:text-5xl font-black leading-tight mb-6"
          >
            {t('ctaFooter.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-surface-dim mb-8"
          >
            {t('ctaFooter.description')}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-end gap-6"
        >
          <Button className="bg-lima text-on-background px-10 py-5 font-medium text-base rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            {t('ctaFooter.ctaLabel')}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 text-white/60"
          >
            <AvatarStack maxVisible={3}>
              {avatarImages.map((src, index) => (
                <Avatar key={index} src={src} alt={`Student ${index + 1}`} size="sm" />
              ))}
            </AvatarStack>
            <span className="text-xs">{t('ctaFooter.studentsCount')}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}