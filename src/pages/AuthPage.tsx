import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuthActions();

  const isRegisterRoute = location.pathname.includes('register') || location.pathname.includes('signUp');
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>(isRegisterRoute ? 'signUp' : 'signIn');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dashboardPath = '/dashboard';

  const handleSubmit = async (e: React.FormEvent, flow: 'signIn' | 'signUp') => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError('Ocurrió un error de autenticación. Revisá tus datos.');
      return;
    }

    try {
      setLoading(true);
      await signIn('password', { email, password, flow });
      setSuccessMessage(flow === 'signIn' ? 'Ingresaste correctamente. Redirigiendo…' : 'Cuenta creada correctamente. Redirigiendo…');
      setTimeout(() => {
        navigate(dashboardPath);
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setError((err as { message?: string })?.message || 'Ocurrió un error de autenticación. Revisá tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      const frontendUrl = window.location.origin;
      await signIn('google', { redirectTo: `${frontendUrl}${dashboardPath}` });
    } catch (err: unknown) {
      console.error(err);
      setError((err as { message?: string })?.message || 'Ocurrió un error de autenticación. Revisá tus datos.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="font-display-lg text-3xl font-black text-on-surface tracking-tight">
            {activeTab === 'signIn' ? 'Bienvenido de nuevo' : 'Creá tu cuenta'}
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            {activeTab === 'signIn' ? 'Ingresá para acceder a tus cursos.' : 'Sumate a Fuega Academy y empezá a aprender.'}
          </p>
        </div>

        <Card className="p-8 bg-surface-container-lowest border border-outline-variant shadow-xl rounded-2xl">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'signIn' | 'signUp')}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signIn" className="text-center justify-center">
                Ingresar
              </TabsTrigger>
              <TabsTrigger value="signUp" className="text-center justify-center">
                Registrarme
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium" role="status">
                {successMessage}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <Button
                type="button"
                variant="secondary"
                size="full"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3 border-outline-variant hover:bg-surface-container-high transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-medium text-on-surface">Continuar con Google</span>
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-on-surface-variant">
                  o
                </span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>
            </div>

            <TabsContent value="signIn">
              <form onSubmit={(e) => handleSubmit(e, 'signIn')} className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Contraseña"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary" size="full" loading={loading}>
                    Ingresar
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signUp">
              <form onSubmit={(e) => handleSubmit(e, 'signUp')} className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="Contraseña"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary" size="full" loading={loading}>
                    Crear cuenta
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
