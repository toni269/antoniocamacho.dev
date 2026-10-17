import { expect, test } from '@playwright/test';

const profile = 'https://www.linkedin.com/in/antonio-camacho-mira/';
for (const colorScheme of ['light', 'dark'] as const) {
  test(`random dots gather around a stationary 44px link and clicking shows a rocket before navigation (${colorScheme})`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const link = page.getByRole('link', {
      name: 'Antonio Camacho Mira on LinkedIn',
    });
    await expect(link).toHaveAttribute('data-enhanced', 'true');
    await expect(link.locator('[data-particle]')).toHaveCount(6);
    const box = await link.boundingBox();
    expect(box!.width).toBe(44);
    expect(box!.height).toBe(44);
    const first = await link
      .locator('[data-particle]')
      .first()
      .getAttribute('style');
    await page.reload();
    await expect(link.locator('[data-particle]')).toHaveCount(6);
    expect(
      await link.locator('[data-particle]').first().getAttribute('style'),
    ).not.toBe(first);
    await expect(link.locator('svg')).toHaveCSS(
      'animation-name',
      'icon-invitation',
    );
    await expect(link.locator('svg')).toHaveCSS(
      'animation-iteration-count',
      'infinite',
    );
    await expect(link.locator('[data-particle]').first()).toHaveCSS(
      'animation-iteration-count',
      'infinite',
    );
    await link.locator('[data-particle]').evaluateAll((dots) => {
      for (const dot of dots)
        for (const animation of dot.getAnimations()) {
          animation.pause();
          animation.currentTime = 1_000;
        }
    });
    expect(
      Number(
        await link
          .locator('[data-particle]')
          .first()
          .evaluate((dot) => getComputedStyle(dot).opacity),
      ),
    ).toBeGreaterThan(0);
    await page.screenshot({
      path: `test-results/${info.project.name}-${colorScheme}-gathering.png`,
    });
    await link.evaluate((anchor) => {
      for (const animation of anchor.getAnimations({ subtree: true })) {
        animation.pause();
        const timing = animation.effect!.getTiming();
        animation.currentTime =
          Number(timing.delay) + Number(timing.duration) * 0.75;
      }
    });
    await expect(link.locator('[data-particle]').first()).toHaveCSS(
      'opacity',
      '0',
    );
    const haloOpacity = await link.evaluate((anchor) =>
      Number(getComputedStyle(anchor, '::before').opacity),
    );
    expect(haloOpacity).toBeCloseTo(colorScheme === 'dark' ? 0.28 : 0.14, 2);
    expect(await link.boundingBox()).toEqual(box);
    await page.screenshot({
      path: `test-results/${info.project.name}-${colorScheme}-halo.png`,
    });
    await link.evaluate((anchor) => {
      for (const animation of anchor.getAnimations({ subtree: true }))
        animation.play();
    });
    await link.hover();
    await expect(link.locator('svg')).toHaveCSS(
      'animation-play-state',
      'running',
    );
    await expect(link.locator('path')).toHaveCSS(
      'fill',
      colorScheme === 'dark' ? 'rgb(41, 146, 250)' : 'rgb(10, 102, 194)',
    );
    expect(
      Number(
        await link.evaluate((anchor) =>
          getComputedStyle(anchor).getPropertyValue('--profile-halo-opacity'),
        ),
      ),
    ).toBeGreaterThan(colorScheme === 'dark' ? 0.28 : 0.14);
    expect(
      await link.evaluate((anchor) =>
        anchor
          .getAnimations({ subtree: true })
          .every((animation) => animation.playState === 'running'),
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${info.project.name}-${colorScheme}-hover.png`,
    });
    await page.mouse.move(0, 0);
    await expect(link.locator('svg')).toHaveCSS(
      'animation-play-state',
      'running',
    );
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1_000));
    await page.route('https://www.linkedin.com/**', (route) =>
      route.fulfill({ body: 'Offline profile fixture.' }),
    );
    await link.click();
    await expect(link.locator('[data-rocket]')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('Opening LinkedIn');
    expect(page.url()).not.toBe(profile);
    await link.click();
    await page.screenshot({
      path: `test-results/${info.project.name}-${colorScheme}-rocket.png`,
    });
    await page.clock.runFor(599);
    expect(page.url()).not.toBe(profile);
    await page.clock.runFor(1);
    await expect(page).toHaveURL(profile);
  });
}

test('reduced motion has no particles or sway and follows preference changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const link = page.getByRole('link');
  await expect(link).toHaveAttribute('data-enhanced', 'true');
  await expect(link.locator('[data-particle]')).toHaveCount(0);
  await expect(link.locator('svg')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(link.locator('[data-particle]')).toHaveCount(6);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(link.locator('[data-particle]')).toHaveCount(0);
  await page.route('https://www.linkedin.com/**', (route) =>
    route.fulfill({ body: 'Offline profile fixture.' }),
  );
  await link.press('Enter');
  await expect(link.locator('[data-rocket]')).toBeVisible();
  await expect(link.locator('[data-rocket]')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page).toHaveURL(profile);
});

test('the native profile link works with JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.route('https://www.linkedin.com/**', (route) =>
      route.fulfill({ body: 'Offline profile fixture.' }),
    );
    await page.goto(baseURL!);
    await page.getByRole('link').click();
    await expect(page).toHaveURL(profile);
  } finally {
    await context.close();
  }
});

test('modified and middle activations are left to the browser', async ({
  page,
}) => {
  await page.goto('/');
  const link = page.getByRole('link');
  await expect(link).toHaveAttribute('data-enhanced', 'true');
  for (const kind of ['modified', 'middle'] as const) {
    await page.evaluate((kind) => {
      // Observe after the link handler, then suppress native navigation only in the test.
      document.addEventListener(
        kind === 'middle' ? 'auxclick' : 'click',
        (event) => {
          document.body.dataset.activationCancelled = String(
            event.defaultPrevented,
          );
          event.preventDefault();
        },
        { once: true },
      );
    }, kind);
    await link.click(
      kind === 'middle'
        ? { button: 'middle' }
        : { modifiers: ['ControlOrMeta'] },
    );
    await expect(page.locator('body')).toHaveAttribute(
      'data-activation-cancelled',
      'false',
    );
    await expect(link).not.toHaveAttribute('data-launching', 'true');
  }
});
