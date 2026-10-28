import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
} from "@/components/ui";
import type { CourseEditorState } from "./useCourseEditor";

interface ScheduleEditorProps {
  schedules: CourseEditorState["schedules"];
  onChange: (schedules: NonNullable<CourseEditorState["schedules"]>) => void;
}

export function ScheduleEditor({
  schedules = [],
  onChange,
}: ScheduleEditorProps) {
  const updateSchedule = (
    index: number,
    patch: Partial<NonNullable<CourseEditorState["schedules"]>[number]>,
  ) =>
    onChange(
      schedules.map((schedule, itemIndex) =>
        itemIndex === index ? { ...schedule, ...patch } : schedule,
      ),
    );

  return (
    <AccordionItem
      value="schedules"
      className="rounded-2xl border border-outline-variant bg-surface-container-low"
    >
      <AccordionTrigger className="rounded-2xl px-5 py-4 hover:bg-surface-container">
        <span>
          <span className="block font-bold">Horarios</span>
          <span className="block text-xs font-normal text-on-surface-variant">
            Cohortes, cupos y sesiones
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-on-surface">
        <div className="space-y-5 px-5 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Horarios</h2>
              <p className="text-sm text-on-surface-variant">
                Quitar un horario guardado lo oculta para nuevas inscripciones,
                pero conserva su historial de alumnos. Los horarios nuevos que
                quites desaparecen al guardar.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange([
                  ...schedules,
                  {
                    name: "New cohort",
                    capacity: 30,
                    startsAt: Date.now() + 7 * 86400000,
                    sessions: [
                      { day: 2, startTime: "19:00", endTime: "21:00" },
                    ],
                  },
                ])
              }
            >
              Agregar horario
            </Button>
          </div>

          <div className="space-y-4">
            {schedules.map((schedule, scheduleIndex) => (
              <div
                key={schedule.id ?? `new-${scheduleIndex}`}
                className="space-y-4 rounded-xl border border-outline-variant bg-surface p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    className="min-w-52 flex-1"
                    value={schedule.name}
                    onChange={(event) =>
                      updateSchedule(scheduleIndex, {
                        name: event.target.value,
                      })
                    }
                    placeholder="Nombre del horario"
                  />
                  <label>
                    Inicio (Buenos Aires)
                    <input
                      type="datetime-local"
                      required
                      value={new Date(schedule.startsAt - 3 * 3600000)
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(event) =>
                        updateSchedule(scheduleIndex, {
                          startsAt: Date.parse(
                            `${event.target.value}:00-03:00`,
                          ),
                        })
                      }
                    />
                  </label>
                  <Input
                    className="w-32"
                    type="number"
                    min={1}
                    value={schedule.capacity}
                    onChange={(event) =>
                      updateSchedule(scheduleIndex, {
                        capacity: Number.parseInt(event.target.value, 10) || 1,
                      })
                    }
                    aria-label="Capacity"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onChange(
                        schedules.filter((_, index) => index !== scheduleIndex),
                      )
                    }
                  >
                    Quitar
                  </Button>
                </div>

                <div className="space-y-2">
                  {schedule.sessions.map((session, sessionIndex) => (
                    <div
                      key={`${schedule.id ?? scheduleIndex}-${sessionIndex}`}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <select
                        className="rounded-xl border border-outline-variant bg-surface px-3 py-2 text-sm"
                        value={session.day}
                        onChange={(event) =>
                          updateSchedule(scheduleIndex, {
                            sessions: schedule.sessions.map((item, index) =>
                              index === sessionIndex
                                ? {
                                    ...item,
                                    day: Number.parseInt(
                                      event.target.value,
                                      10,
                                    ),
                                  }
                                : item,
                            ),
                          })
                        }
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day, index) => (
                          <option key={day} value={index + 1}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <Input
                        className="w-32"
                        type="time"
                        value={session.startTime}
                        onChange={(event) =>
                          updateSchedule(scheduleIndex, {
                            sessions: schedule.sessions.map((item, index) =>
                              index === sessionIndex
                                ? { ...item, startTime: event.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                      <span className="text-sm text-on-surface-variant">a</span>
                      <Input
                        className="w-32"
                        type="time"
                        value={session.endTime}
                        onChange={(event) =>
                          updateSchedule(scheduleIndex, {
                            sessions: schedule.sessions.map((item, index) =>
                              index === sessionIndex
                                ? { ...item, endTime: event.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateSchedule(scheduleIndex, {
                            sessions: schedule.sessions.filter(
                              (_, index) => index !== sessionIndex,
                            ),
                          })
                        }
                      >
                        Quitar sesión
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateSchedule(scheduleIndex, {
                        sessions: [
                          ...schedule.sessions,
                          { day: 5, startTime: "18:00", endTime: "20:00" },
                        ],
                      })
                    }
                  >
                    Agregar sesión
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
