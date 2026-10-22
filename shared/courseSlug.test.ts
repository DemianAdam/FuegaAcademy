import { describe, expect, it } from 'vitest';
import { slugifyCourseTitle } from './courseSlug';

describe('slugifyCourseTitle', () => {
  it('creates readable URL segments from an accented title', () => {
    expect(slugifyCourseTitle('  Marketing Digital: Básico  ')).toBe('marketing-digital-basico');
  });

  it('uses a stable fallback for titles without URL characters', () => {
    expect(slugifyCourseTitle('✨')).toBe('course');
  });
});
