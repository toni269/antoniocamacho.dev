import { describe, expect, it } from 'vitest';
import { validateRuntime } from '../../scripts/check-runtime.mjs';

describe('project runtime contract', () => {
  it('accepts the exact pinned patch and rejects drifting versions', () => {
    expect(validateRuntime('24.22.0', '24.22.0')).toBe(true);
    for (const actual of ['24.19.0', '24.23.0', '25.0.0', '']) {
      expect(validateRuntime(actual, '24.22.0')).toBe(false);
    }
  });
});
