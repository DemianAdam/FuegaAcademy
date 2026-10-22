import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

const navLinks = [{ href: '/courses', label: 'Cursos' }, { href: '/teachers', label: 'Profesores' }, { href: '/#como-funciona', label: 'Cómo funciona' }, { href: '/#testimonios', label: 'Testimonios' }];
export function Header() {
  const location = useLocation(); const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant relative"><nav className="flex justify-between items-center w-full px-4 md:px-margin-desktop py-4" aria-label="Main navigation">
    <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Fuega Academy"><svg className="w-8 h-8 fill-lima" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12 2 15 5.5 15 9.5C15 13.5 12 17 12 17C12 17 9 13.5 9 9.5C9 5.5 12 2 12 2Z" /></svg><span className="font-display-lg text-lg md:text-xl font-black tracking-tighter text-on-surface uppercase">Fuega <span className="text-secondary">Academy</span></span></Link>
    <div className="hidden lg:flex items-center gap-8">{navLinks.map((link) => <Link key={link.href} to={link.href} className={cn('font-label-md text-label-md transition-colors', location.pathname === link.href ? 'text-primary' : 'text-on-surface-variant hover:text-primary')}>{link.label}</Link>)}</div>
    <div className="hidden md:flex items-center gap-4"><ThemeToggle /><Link to="/login" className="text-on-surface font-label-md hover:text-primary transition-colors px-2">Ingresar</Link><Link to="/register"><Button variant="primary" className="rounded-full px-5 py-2.5">Empezar ahora</Button></Link></div>
    <div className="flex md:hidden items-center gap-3"><ThemeToggle /><Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="p-2 rounded-lg"><span className="material-symbols-outlined text-2xl">{isMenuOpen ? 'close' : 'menu'}</span></Button></div>
  </nav>{isMenuOpen && <div className="absolute top-full left-0 w-full bg-surface/95 border-b border-outline-variant px-6 py-6 space-y-4 flex flex-col shadow-2xl md:hidden">{navLinks.map((link) => <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="text-on-surface font-medium text-base py-1">{link.label}</Link>)}<hr className="border-outline-variant" /><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link><Link to="/register" onClick={() => setIsMenuOpen(false)}><Button variant="primary" className="w-full rounded-full py-3">Start now</Button></Link></div>}</header>;
}
