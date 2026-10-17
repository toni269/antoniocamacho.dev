import {
  createParticles,
  createProfileLaunch,
  shouldHandleActivation,
} from '../lib/linkedin-motion';

/** Enhance existing native anchors once. Decoration is local, optional and pointer-inert. */
export function enhanceLinkedInLinks(): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    '[data-linkedin-link]',
  )) {
    if (link.dataset.enhanced) continue;
    const particles = link.querySelector<HTMLElement>('[data-particles]');
    const status = link.querySelector<HTMLElement>('[data-launch-status]');
    if (!particles || !status) continue;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

    /** Preference changes remove existing decoration immediately; no page reload is needed. */
    const updateMotion = () => {
      particles.replaceChildren();
      link.dataset.motion = preference.matches ? 'reduced' : 'active';
      if (preference.matches) return;
      for (const particle of createParticles()) {
        const dot = document.createElement('span');
        dot.dataset.particle = 'true';
        dot.style.setProperty('--from-x', `${particle.x}px`);
        dot.style.setProperty('--from-y', `${particle.y}px`);
        dot.style.setProperty('--dot-size', `${particle.size}px`);
        dot.style.setProperty('--gather-duration', `${particle.duration}ms`);
        dot.style.setProperty('--gather-delay', `${particle.delay}ms`);
        particles.append(dot);
      }
    };
    const launch = createProfileLaunch(
      link.href,
      () => {
        link.dataset.launching = 'true';
        status.textContent = 'Opening LinkedIn';
      },
      (destination) => window.location.assign(destination),
    );
    link.addEventListener('click', (event) => {
      if (
        !shouldHandleActivation(event) ||
        link.hasAttribute('download') ||
        (link.target && link.target !== '_self')
      )
        return;
      event.preventDefault();
      launch();
    });
    preference.addEventListener('change', updateMotion);
    updateMotion();
    link.dataset.enhanced = 'true';
  }
}
