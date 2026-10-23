import { describe, expect, it } from 'vitest';
import { courseCreateInputValidator, courseValidator } from './courses';

describe('published-only course contracts', () => {
  it('does not accept draft course status', () => {
    expect(courseValidator.shape.status.safeParse('draft').success).toBe(false);
    expect(courseValidator.shape.status.safeParse('published').success).toBe(true);
    expect(courseValidator.shape.status.safeParse('archived').success).toBe(true);
  });

  it('omits status from create inputs', () => {
    expect('status' in courseCreateInputValidator.shape).toBe(false);
  });
});
