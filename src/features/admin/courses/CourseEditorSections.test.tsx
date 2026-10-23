import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Accordion } from '@/components/ui';
import { CourseAchievementsSection } from './CourseEditorSections';
import { createEmptyCourse } from './useCourseEditor';
import { ScheduleEditor } from './ScheduleEditor';

afterEach(() => cleanup());

function AchievementHarness() {
  const [course, setCourse] = useState(createEmptyCourse());
  const [achievementIds, setAchievementIds] = useState(['achievement-1']);
  return <Accordion type="multiple" defaultValue={['outcomes']}><CourseAchievementsSection course={course} onChange={(key, value) => setCourse((current) => ({ ...current, [key]: value }))} achievementIds={achievementIds} onAchievementIdsChange={setAchievementIds} /></Accordion>;
}

describe('CourseAchievementsSection', () => {
  it('keeps achievement input focus while typing multiple characters', async () => {
    const user = userEvent.setup();
    render(<AchievementHarness />);

    const input = screen.getByPlaceholderText('Resultado concreto');
    await user.clear(input);
    await user.type(input, 'abc');

    expect((input as HTMLInputElement).value).toBe('abc');
  });

  it('filters the inline icon rail without closing it', async () => {
    const user = userEvent.setup();
    render(<AchievementHarness />);

    const search = screen.getByLabelText('Buscar icono');
    await user.type(search, 'rocket');

    expect(screen.getByRole('button', { name: 'rocket_launch' })).not.toBeNull();
    expect((search as HTMLInputElement).value).toBe('rocket');
  });

  it('explains that removed saved cohorts retain their history', () => {
    render(<Accordion type="multiple" defaultValue={['schedules']}><ScheduleEditor schedules={[]} onChange={vi.fn()} /></Accordion>);
    expect(screen.getByText(/oculta para nuevas inscripciones/i)).not.toBeNull();
  });
});
