/** Transient decorative data; coordinates are relative to the fixed link center. */
export interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

/** Six bounded trajectories. An injectable random source makes boundary checks deterministic. */
export function createParticles(
  random: () => number = Math.random,
): Particle[] {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const radius = 36 + random() * 28;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 6 + random() * 4,
      duration: 1800 + random() * 1000,
      delay: index * 100,
    };
  });
}

/** Enhance primary/Enter clicks only; preserve browser tabs, context actions and prior handlers. */
export function shouldHandleActivation(
  event: Pick<
    MouseEvent,
    | 'button'
    | 'ctrlKey'
    | 'metaKey'
    | 'altKey'
    | 'shiftKey'
    | 'defaultPrevented'
  >,
): boolean {
  return (
    event.button === 0 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey &&
    !event.defaultPrevented
  );
}

/** Show feedback synchronously, then navigate once after 600ms, even after repeated activation.
 * Callers own the actual DOM/navigation; the destination remains the anchor's public href.
 */
export function createProfileLaunch(
  destination: string,
  feedback: () => void,
  navigate: (destination: string) => void,
): () => void {
  let launching = false;
  return () => {
    if (launching) return;
    launching = true;
    feedback();
    setTimeout(() => navigate(destination), 600);
  };
}
