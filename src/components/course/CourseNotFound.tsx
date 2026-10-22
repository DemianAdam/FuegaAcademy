import { Button } from '../ui/Button';
import { AppLink } from '../shared/AppLink';

export function CourseNotFound() {

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-2">Curso no encontrado</h1>
      <p className="text-on-surface-variant mb-6">El curso que buscás no existe o fue eliminado.</p>
      <AppLink to="/">
        <Button variant="primary">Volver al inicio</Button>
      </AppLink>
    </div>
  );
}
