import { useLanguage } from '../../lib/useLanguage';
import { Camera, PlayCircle, MessageCircle } from 'lucide-react';
import { LocalizedLink } from '../shared/LocalizedLink';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-inverse-surface text-on-tertiary-fixed py-20 px-margin-desktop border-t border-white/5">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 fill-lima" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z"></path>
              </svg>
              <span className="font-display-lg text-lg font-black text-white uppercase tracking-tighter">Fuega Academy</span>
            </div>
            <p className="text-surface-dim text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h5 className="text-white font-bold mb-6">{t('footer.explorar')}</h5>
            <ul className="space-y-4 text-surface-dim">
              <li><LocalizedLink to="/courses" className="font-medium text-base hover:text-lima transition-colors">{t('footer.cursosEnVivo')}</LocalizedLink></li>
              <li><LocalizedLink to="/courses" className="font-medium text-base hover:text-lima transition-colors">{t('footer.cursosGrabados')}</LocalizedLink></li>
              <li><LocalizedLink to="/courses" className="font-medium text-base hover:text-lima transition-colors">{t('footer.talleresGratuitos')}</LocalizedLink></li>
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h5 className="text-white font-bold mb-6">{t('footer.comunidad')}</h5>
            <ul className="space-y-4 text-surface-dim">
              <li><LocalizedLink to="#" className="font-medium text-base hover:text-lima transition-colors">{t('footer.nuestroDiscord')}</LocalizedLink></li>
              <li><LocalizedLink to="#" className="font-medium text-base hover:text-lima transition-colors">{t('footer.blog')}</LocalizedLink></li>
              <li><LocalizedLink to="#" className="font-medium text-base hover:text-lima transition-colors">{t('footer.eventos')}</LocalizedLink></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="text-white font-bold mb-6">{t('footer.contacto')}</h5>
            <ul className="space-y-4 text-sm text-surface-dim">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lima text-lg" aria-hidden="true">mail</span>
                hola@fuega.academy
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lima text-lg" aria-hidden="true">phone</span>
                +54 9 11 0000-0000
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-surface-dim text-xs">
            © 2024 Fuega Academy. {t('footer.rights')}
          </p>
          <div className="flex gap-6">
            <LocalizedLink to="#" className="text-white/60 hover:text-lima transition-all" aria-label="Instagram">
              <Camera className="w-5 h-5" aria-hidden="true" />
            </LocalizedLink>
            <LocalizedLink to="#" className="text-white/60 hover:text-lima transition-all" aria-label="YouTube">
              <PlayCircle className="w-5 h-5" aria-hidden="true" />
            </LocalizedLink>
            <LocalizedLink to="#" className="text-white/60 hover:text-lima transition-all" aria-label="Discord">
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}