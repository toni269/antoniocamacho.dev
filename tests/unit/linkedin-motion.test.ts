import { expect, it } from 'vitest';
import {
  createParticles,
  shouldHandleActivation,
} from '../../src/lib/linkedin-motion';

it('generates six bounded particles with independently randomized trajectories', () => {
  const low = createParticles(() => 0);
  const high = createParticles(() => 1);
  expect(low).toHaveLength(6);
  expect(high).not.toEqual(low);
  for (const particle of [...low, ...high]) {
    const radius = Math.hypot(particle.x, particle.y);
    expect(radius).toBeGreaterThanOrEqual(36);
    expect(radius).toBeLessThanOrEqual(64.001);
    expect(particle.size).toBeGreaterThanOrEqual(6);
    expect(particle.size).toBeLessThanOrEqual(10);
    expect(particle.duration + particle.delay).toBeLessThanOrEqual(4_000);
  }
});
it('enhances primary and keyboard clicks while preserving native modified activation', () => {
  const plain = {
    button: 0,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    defaultPrevented: false,
  };
  expect(shouldHandleActivation(plain)).toBe(true);
  for (const modifier of [
    'ctrlKey',
    'metaKey',
    'altKey',
    'shiftKey',
    'defaultPrevented',
  ])
    expect(shouldHandleActivation({ ...plain, [modifier]: true })).toBe(false);
  expect(shouldHandleActivation({ ...plain, button: 1 })).toBe(false);
  expect(shouldHandleActivation({ ...plain, button: 2 })).toBe(false);
});
