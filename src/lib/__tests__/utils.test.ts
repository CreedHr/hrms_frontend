import { describe, expect, it } from 'vitest';
import { contrastText, initials, money, toneFor } from '@/lib/utils';

describe('formatting helpers', () => {
  it('maps statuses to tones', () => {
    expect(toneFor('Active')).toBe('g');
    expect(toneFor('Rejected')).toBe('r');
    expect(toneFor('Pending')).toBe('y');
    expect(toneFor('Processing')).toBe('y');
  });

  it('formats money and initials', () => {
    expect(money(9200)).toBe('$9,200');
    expect(money(9200, true)).toBe('$9.2k');
    expect(initials('Ava Patel')).toBe('AP');
  });

  it('picks readable accent text', () => {
    expect(contrastText('#facc15')).toBe('#111111');
    expect(contrastText('#2b9cf2')).toBe('#ffffff');
  });
});
