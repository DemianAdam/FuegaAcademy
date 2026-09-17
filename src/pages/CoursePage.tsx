import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../data/courses';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { PolaroidFrame } from '../components/shared/PolaroidFrame';

export function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  useTranslation('course');
  const [formatType, setFormatType] = useState<'live' | 'recorded'>('live');
  
  const course = courses.find((c) => c.id === slug);

  // Default to first available schedule that is not full, or first schedule
  const defaultScheduleId = course?.schedules.find(s => s.enrolledCount < s.capacity)?.id || course?.schedules[0]?.id || '';
  const [selectedScheduleId, setSelectedScheduleId] = useState(defaultScheduleId);

  if (!course) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <h1 className="font-display-lg text-3xl font-bold text-on-surface mb-2">Curso no encontrado</h1>
        <p className="text-on-surface-variant mb-6">El curso que buscas no existe o fue removido.</p>
        <Link to="/">
          <Button variant="primary">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* Hero Section */}
      <section className="bg-surface-container-low border-b border-outline-variant py-16 px-4 md:px-margin-desktop">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              {course.badge === 'most-chosen' ? 'Más Elegido' : course.badge === 'new' ? 'Nuevo' : 'Popular'}
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl font-black tracking-tight text-on-surface">
              {course.title}
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span className="text-sm font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">videocam</span>
                <span className="text-sm font-medium">{course.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="text-sm font-medium">Acceso de por vida</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <PolaroidFrame
              src={course.polaroidImage}
              alt={course.title}
              caption={course.polaroidCaption}
              rotate={2}
              scale={1.05}
            />
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Tabs (Overview, Curriculum, Mentor) */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="curriculum">Programa de Estudios</TabsTrigger>
              <TabsTrigger value="mentor">Profesor</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Lo que vas a lograr</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.achievements.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                      <span className="material-symbols-outlined text-primary shrink-0">{item.icon}</span>
                      <p className={`text-sm ${item.bold ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {course.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-outline-variant text-center bg-surface-container-low">
                    <span className="material-symbols-outlined text-primary text-2xl mb-1">{stat.icon}</span>
                    <div className="text-xl font-black text-on-surface">{stat.value}</div>
                    <div className="text-xs text-on-surface-variant font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Módulos del Curso</h2>
                <p className="text-on-surface-variant text-sm mb-6">Desplegá cada sección para ver el contenido detallado.</p>
              </div>
              <Accordion type="single" collapsible defaultValue="module-1">
                {course.modules.map((mod) => (
                  <AccordionItem key={mod.id} value={mod.id}>
                    <AccordionTrigger>{mod.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {mod.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Mentor Tab */}
            <TabsContent value="mentor">
              <div className="p-8 rounded-2xl border border-outline-variant bg-surface-container-low flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={course.mentor.image}
                  alt={course.mentor.name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary shrink-0"
                />
                <div className="space-y-3 text-center md:text-left">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{course.mentor.title}</span>
                  <h3 className="text-2xl font-bold text-on-surface">{course.mentor.name}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{course.mentor.bio}</p>
                  <blockquote className="italic text-xs text-on-surface-variant border-l-2 border-primary pl-3">
                    "{course.mentor.quote}"
                  </blockquote>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Pricing & Schedule Selection Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-2xl border border-outline-variant bg-surface-container-low space-y-6 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-on-surface">Inscripción</span>
              <div className="flex gap-1 bg-surface p-1 rounded-lg border border-outline-variant">
                <button
                  onClick={() => setFormatType('live')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${formatType === 'live' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Vivo
                </button>
                <button
                  onClick={() => setFormatType('recorded')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${formatType === 'recorded' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Grabado
                </button>
              </div>
            </div>

            <div className="text-3xl font-black text-on-surface">
              {formatType === 'live' ? course.pricing.live.price : course.pricing.recorded.price}
              <span className="text-xs font-normal text-on-surface-variant ml-2">pago único</span>
            </div>

            {formatType === 'live' && course.schedules && course.schedules.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Elegí tu grupo y horarios:
                  </label>
                  <span className="text-xs text-primary font-medium">Cupos limitados</span>
                </div>
                <div className="space-y-2.5">
                  {course.schedules.map((sched) => {
                    const isFull = sched.enrolledCount >= sched.capacity;
                    const isSelected = selectedScheduleId === sched.id;

                    return (
                      <button
                        key={sched.id}
                        disabled={isFull}
                        onClick={() => setSelectedScheduleId(sched.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                          isFull
                            ? 'border-outline-variant bg-surface opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-sm'
                            : 'border-outline-variant hover:bg-surface text-on-surface-variant'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {sched.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isFull ? 'bg-error/10 text-error' : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {isFull ? 'Completo' : `${sched.capacity - sched.enrolledCount} lugares libres`}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {sched.sessions.map((sess, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                              <span className="material-symbols-outlined text-xs text-primary">event</span>
                              <span className="font-medium text-on-surface">{sess.day}:</span>
                              <span>{sess.startTime} - {sess.endTime}hs</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button variant="primary" className="w-full py-4 font-bold text-base shadow-md">
                Inscribirme Ahora
              </Button>
              <p className="text-center text-xs text-on-surface-variant">
                🔒 Pago seguro vía Stripe / PayPal. Cupos atómicos garantizados.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
