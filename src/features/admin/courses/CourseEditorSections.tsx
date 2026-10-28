import { useMemo, useRef, useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
} from "@/components/ui";
import type { CourseEditorState } from "./useCourseEditor";
import { activeTiersForFormat } from "@shared/courseCommerce";
import { ImageSourceField } from "../media/ImageSourceField";

type Change = <Key extends keyof CourseEditorState>(
  key: Key,
  value: CourseEditorState[Key],
) => void;
type Props = { course: CourseEditorState; onChange: Change };
type TeacherOption = { _id: Id<"teachers">; name: string; title: string };

export function CourseEditorSections({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={["details", "media"]}
      className="space-y-3 border-0"
    >
      {children}
    </Accordion>
  );
}

function Section({
  value,
  title,
  summary,
  children,
}: {
  value: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={value}
      className="rounded-2xl border border-outline-variant bg-surface-container-low"
    >
      <AccordionTrigger className="rounded-2xl px-5 py-4 hover:bg-surface-container">
        <span>
          <span className="block font-bold">{title}</span>
          <span className="block text-xs font-normal text-on-surface-variant">
            {summary}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-on-surface">
        <div className="space-y-4 px-5 pb-5">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function CourseBasicsSection({
  course,
  teachers,
  onChange,
  onFormatChange,
}: Props & {
  teachers: TeacherOption[];
  onFormatChange: (format: CourseEditorState["format"]) => void;
}) {
  return (
    <Section
      value="details"
      title="Información del curso"
      summary="Título, descripción, profesor y publicación"
    >
      <p className="text-xs text-on-surface-variant">
        La URL pública se genera automáticamente desde el título al guardar. El
        curso se publica al guardar.
      </p>
      <label className="block text-sm font-medium">
        Título
        <Input
          className="mt-1"
          required
          value={course.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium">
        Descripción
        <textarea
          className="mt-1 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm"
          required
          rows={4}
          value={course.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Clases
          <Input
            className="mt-1"
            type="number"
            min={1}
            value={course.duration}
            onChange={(e) =>
              onChange("duration", Number.parseInt(e.target.value, 10) || 1)
            }
          />
        </label>
        <label className="text-sm font-medium">
          Modalidad
          <select
            className="mt-1 w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5"
            value={course.format}
            onChange={(e) =>
              onFormatChange(e.target.value as CourseEditorState["format"])
            }
          >
            <option value="live">En vivo</option>
            <option value="recorded">Grabado</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Profesor
        <select
          className="mt-1 w-full rounded-xl border border-outline-variant bg-surface px-4 py-2.5"
          required
          value={course.teacherId}
          onChange={(e) =>
            onChange("teacherId", e.target.value as Id<"teachers">)
          }
        >
          <option value="">Seleccioná un profesor</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name} — {teacher.title}
            </option>
          ))}
        </select>
      </label>
    </Section>
  );
}

export function CourseMediaSection({ course, onChange }: Props) {
  return (
    <Section value="media" title="Multimedia" summary="Imágenes y etiqueta">
      <ImageSourceField
        label="Imagen principal"
        value={course.image}
        onChange={(image) => onChange("image", image)}
      />
      <ImageSourceField
        label="Imagen polaroid"
        value={course.polaroid}
        onChange={(polaroid) => onChange("polaroid", polaroid)}
      />
      <Input
        required
        placeholder="Texto de la imagen polaroid"
        value={course.polaroidCaption}
        onChange={(e) => onChange("polaroidCaption", e.target.value)}
      />
      <Input
        placeholder="Etiqueta (opcional)"
        value={course.badge ?? ""}
        onChange={(e) => onChange("badge", e.target.value || undefined)}
      />
    </Section>
  );
}

const icons = [
  "check_circle",
  "workspace_premium",
  "school",
  "star",
  "lightbulb",
  "rocket_launch",
  "trending_up",
  "business_center",
  "groups",
  "campaign",
  "play_circle",
  "edit",
  "photo_camera",
  "video_camera_front",
  "palette",
  "code",
  "analytics",
  "language",
  "public",
  "auto_awesome",
];
function move<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}
function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const railRef = useRef<HTMLDivElement>(null);
  const shown = useMemo(
    () => icons.filter((icon) => icon.includes(query.toLowerCase())),
    [query],
  );
  const scrollRail = (direction: number) =>
    railRef.current?.scrollBy({ left: direction * 180, behavior: "smooth" });
  return (
    <div className="w-full space-y-2 rounded-xl border border-outline-variant bg-surface-container-low p-2 sm:flex-1 sm:min-w-0">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface">
          <span className="material-symbols-outlined text-primary">
            {value}
          </span>
        </span>
        <Input
          aria-label="Buscar icono"
          placeholder="Buscar icono"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Iconos anteriores"
          onClick={() => scrollRail(-1)}
        >
          ←
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Iconos siguientes"
          onClick={() => scrollRail(1)}
        >
          →
        </Button>
      </div>
      <div
        ref={railRef}
        className="flex gap-1 overflow-x-auto pb-1"
        role="listbox"
        aria-label="Iconos disponibles"
      >
        {shown.length > 0 ? (
          shown.map((icon) => (
            <button
              key={icon}
              type="button"
              title={icon}
              aria-label={icon}
              aria-selected={value === icon}
              onClick={() => onChange(icon)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-primary/10 ${value === icon ? "bg-primary/15 text-primary ring-1 ring-primary" : ""}`}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))
        ) : (
          <span className="px-2 py-2 text-xs text-on-surface-variant">
            No hay iconos que coincidan.
          </span>
        )}
      </div>
    </div>
  );
}

export function CourseAchievementsSection({
  course,
  onChange,
  achievementIds,
  onAchievementIdsChange,
}: Props & {
  achievementIds: string[];
  onAchievementIdsChange: (ids: string[]) => void;
}) {
  const achievements = course.achievements;
  const update = (
    index: number,
    patch: Partial<(typeof achievements)[number]>,
  ) =>
    onChange(
      "achievements",
      achievements.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  const addAchievement = () => {
    onAchievementIdsChange([...achievementIds, crypto.randomUUID()]);
    onChange("achievements", [
      ...achievements,
      { icon: "check_circle", text: "", isHighlighted: false },
    ]);
  };
  const moveAchievement = (index: number, direction: -1 | 1) => {
    onAchievementIdsChange(move(achievementIds, index, direction));
    onChange("achievements", move(achievements, index, direction));
  };
  const removeAchievement = (index: number) => {
    onAchievementIdsChange(
      achievementIds.filter((_, itemIndex) => itemIndex !== index),
    );
    onChange(
      "achievements",
      achievements.filter((_, itemIndex) => itemIndex !== index),
    );
  };
  return (
    <Section
      value="outcomes"
      title="Resultados"
      summary={`${achievements.length} logro${achievements.length === 1 ? "" : "s"} para el estudiante`}
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAchievement}
        >
          Agregar logro
        </Button>
      </div>
      {achievements.map((achievement, index) => (
        <div
          key={achievementIds[index] ?? `achievement-${index}`}
          className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant bg-surface p-3"
        >
          <IconPicker
            value={achievement.icon}
            onChange={(icon) => update(index, { icon })}
          />
          <Input
            className="min-w-48 flex-1"
            required
            placeholder="Resultado concreto"
            value={achievement.text}
            onChange={(e) => update(index, { text: e.target.value })}
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={achievement.isHighlighted ?? false}
              onChange={(e) =>
                update(index, { isHighlighted: e.target.checked })
              }
            />{" "}
            Destacar
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            onClick={() => moveAchievement(index, -1)}
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === achievements.length - 1}
            onClick={() => moveAchievement(index, 1)}
          >
            ↓
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeAchievement(index)}
          >
            Quitar
          </Button>
        </div>
      ))}
    </Section>
  );
}

export function CourseCurriculumSection({ course, onChange }: Props) {
  const modules = course.modules ?? [];
  const updateModule = (
    index: number,
    patch: Partial<(typeof modules)[number]>,
  ) =>
    onChange(
      "modules",
      modules.map((module, moduleIndex) =>
        moduleIndex === index ? { ...module, ...patch } : module,
      ),
    );
  return (
    <Section
      value="curriculum"
      title="Programa"
      summary={`${modules.length} módulo${modules.length === 1 ? "" : "s"} y sus lecciones`}
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange("modules", [
              ...modules,
              { title: `Módulo ${modules.length + 1}`, lessons: [] },
            ])
          }
        >
          Agregar módulo
        </Button>
      </div>
      {modules.map((module, moduleIndex) => (
        <div
          key={module.id ?? `module-${moduleIndex}`}
          className="space-y-3 rounded-xl border border-outline-variant bg-surface p-4"
        >
          <div className="flex flex-wrap gap-2">
            <Input
              className="min-w-52 flex-1"
              required
              value={module.title}
              onChange={(e) =>
                updateModule(moduleIndex, { title: e.target.value })
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={moduleIndex === 0}
              onClick={() =>
                onChange("modules", move(modules, moduleIndex, -1))
              }
            >
              ↑
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={moduleIndex === modules.length - 1}
              onClick={() => onChange("modules", move(modules, moduleIndex, 1))}
            >
              ↓
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                onChange(
                  "modules",
                  modules.filter((_, index) => index !== moduleIndex),
                )
              }
            >
              Quitar
            </Button>
          </div>
          {module.lessons.map((lesson, lessonIndex) => (
            <div
              key={lesson.id}
              className="rounded-lg border border-outline-variant p-3"
            >
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  required
                  placeholder="Título de la lección"
                  value={lesson.title}
                  onChange={(e) =>
                    updateModule(moduleIndex, {
                      lessons: module.lessons.map((item, index) =>
                        index === lessonIndex
                          ? { ...item, title: e.target.value }
                          : item,
                      ),
                    })
                  }
                />
                <Input
                  className="w-24"
                  type="number"
                  min={0}
                  aria-label="Duración en minutos"
                  value={lesson.durationMinutes}
                  onChange={(e) =>
                    updateModule(moduleIndex, {
                      lessons: module.lessons.map((item, index) =>
                        index === lessonIndex
                          ? {
                              ...item,
                              durationMinutes:
                                Number.parseInt(e.target.value, 10) || 0,
                            }
                          : item,
                      ),
                    })
                  }
                />
              </div>
              <textarea
                className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
                rows={2}
                placeholder="Descripción de la lección"
                value={lesson.description}
                onChange={(e) =>
                  updateModule(moduleIndex, {
                    lessons: module.lessons.map((item, index) =>
                      index === lessonIndex
                        ? { ...item, description: e.target.value }
                        : item,
                    ),
                  })
                }
              />
              <div className="mt-2 flex justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={lessonIndex === 0}
                  onClick={() =>
                    updateModule(moduleIndex, {
                      lessons: move(module.lessons, lessonIndex, -1),
                    })
                  }
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={lessonIndex === module.lessons.length - 1}
                  onClick={() =>
                    updateModule(moduleIndex, {
                      lessons: move(module.lessons, lessonIndex, 1),
                    })
                  }
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    updateModule(moduleIndex, {
                      lessons: module.lessons.filter(
                        (_, index) => index !== lessonIndex,
                      ),
                    })
                  }
                >
                  Quitar
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              updateModule(moduleIndex, {
                lessons: [
                  ...module.lessons,
                  {
                    id: crypto.randomUUID(),
                    title: "",
                    durationMinutes: 0,
                    description: "",
                  },
                ],
              })
            }
          >
            + Agregar lección
          </Button>
        </div>
      ))}
    </Section>
  );
}

export function CoursePricingSection({ course, onChange }: Props) {
  const tiers = activeTiersForFormat(course.format);
  const updateTier = (tier: "live" | "recorded", value: string) => {
    const pricing = { ...course.pricing };
    if (value === "") delete pricing[tier];
    else
      pricing[tier] = {
        amountMinor: Math.round((Number.parseFloat(value) || 0) * 100),
        currency: "ARS",
      };
    onChange("pricing", pricing);
  };
  return (
    <Section
      value="pricing"
      title="Precios"
      summary="Montos en pesos argentinos"
    >
      <p className="text-xs text-on-surface-variant">
        Completá los precios activos para publicar el curso.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {tiers.map((tier) => (
          <label key={tier} className="text-sm font-medium">
            {tier === "live" ? "En vivo (ARS)" : "Grabado (ARS)"}
            <Input
              className="mt-1"
              type="number"
              min={0}
              step="0.01"
              required
              value={
                course.pricing[tier]?.amountMinor === undefined
                  ? ""
                  : course.pricing[tier]!.amountMinor / 100
              }
              onChange={(e) => updateTier(tier, e.target.value)}
            />
          </label>
        ))}
      </div>
    </Section>
  );
}
