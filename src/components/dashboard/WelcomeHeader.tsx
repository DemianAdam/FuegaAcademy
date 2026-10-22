interface WelcomeHeaderProps { userName: string; }

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <header className="mb-stack-lg relative">
      <h2 className="font-headline-lg text-3xl font-bold mb-2">¡Hola, {userName}! 👋</h2>
      <p className="text-on-surface-variant font-body-lg">Es momento de <span className="highlighter">aprender hoy</span> para trabajar desde cualquier lugar.</p>
      <div className="hidden lg:block absolute right-0 top-0 text-right">
        <span className="handwritten text-accent-handwritten text-secondary">Estás a solo 2 clases de terminar tu curso actual.</span>
        <span className="material-symbols-outlined text-secondary align-top ml-2">draw</span>
      </div>
    </header>
  );
}
