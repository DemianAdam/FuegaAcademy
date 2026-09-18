import { Trans, useTranslation } from 'react-i18next';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  const { t } = useTranslation('dashboard');

  return (
    <header className="mb-stack-lg relative">
      {/* Saludo traducido dinámicamente con tamaño grande y negrita */}
      <h2 className="font-headline-lg text-3xl font-bold mb-2">
        {t('welcome.greeting', { name: userName })}
      </h2>

      <p className="text-on-surface-variant font-body-lg">
        <Trans i18nKey="welcome.subtitle" ns="dashboard">
          Es momento de <span className="highlighter">aprender hoy</span> para trabajar desde cualquier lugar.
        </Trans>
      </p>

      <div className="hidden lg:block absolute right-0 top-0 text-right">
        <span className="handwritten text-accent-handwritten text-secondary">
          <Trans i18nKey="welcome.note" ns="dashboard">
            Estás a solo 2 clases de <br /> terminar tu curso actual.
          </Trans>
        </span>
        <span className="material-symbols-outlined text-secondary align-top ml-2">draw</span>
      </div>
    </header>
  );
}