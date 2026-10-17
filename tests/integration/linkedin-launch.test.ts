import { afterEach, expect, it, vi } from 'vitest';
import { createProfileLaunch } from '../../src/lib/linkedin-motion';
import { siteIdentity } from '../../src/content/site';

afterEach(() => vi.useRealTimers());
/** Exercise real public content and the timed launch boundary without contacting LinkedIn. */
it('shows launch feedback before navigating once to the confirmed profile after 600ms', () => {
  vi.useFakeTimers();
  const feedback = vi.fn();
  const navigate = vi.fn();
  const launch = createProfileLaunch(
    siteIdentity.linkedInUrl,
    feedback,
    navigate,
  );
  launch();
  launch();
  expect(feedback).toHaveBeenCalledTimes(1);
  expect(navigate).not.toHaveBeenCalled();
  vi.advanceTimersByTime(599);
  expect(navigate).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(navigate).toHaveBeenCalledExactlyOnceWith(siteIdentity.linkedInUrl);
  launch();
  vi.runAllTimers();
  expect(navigate).toHaveBeenCalledTimes(1);
});
