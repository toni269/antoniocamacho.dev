import { test, expect, type Page } from '@playwright/test';

/** Capture decoded unique initial response bodies, never browser timing or compression. */
function inventory(page: Page) {
  const bodies = new Map<string, Promise<Buffer>>();
  const external = new Set<string>();
  const origin = new URL(test.info().project.use.baseURL!).origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin) external.add(request.url());
  });
  page.on('response', (response) => {
    if (response.ok()) bodies.set(response.url(), response.body());
  });
  return async () => {
    const resources = await Promise.all(
      [...bodies].map(async ([url, body]) => ({
        url,
        bytes: (await body).length,
      })),
    );
    return {
      resources,
      totalBytes: resources.reduce((sum, resource) => sum + resource.bytes, 0),
      external: [...external],
    };
  };
}
/** These checks are also exercised with intentionally invalid resource fixtures. */
function assertBudget(result: { totalBytes: number; external: string[] }) {
  expect(result.totalBytes).toBeLessThanOrEqual(102_400);
  expect(result.external).toEqual([]);
}

test('built WIP content, design, profile and identity meet the public contract', async ({
  page,
}, info) => {
  const readInventory = inventory(page);
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('WIP');
  await expect(page.locator('main p')).toHaveText('We are working on it.');
  await expect(page.locator('main p')).toHaveCSS('font-size', '24px');
  const link = page.getByRole('link', {
    name: 'Antonio Camacho Mira on LinkedIn',
  });
  await expect(link).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/antonio-camacho-mira/',
  );
  await expect(link).not.toHaveAttribute('target', '_blank');
  await expect(link.locator('path')).toHaveCSS('fill', 'rgb(10, 102, 194)');
  await expect(link.locator('svg')).toHaveAttribute('width', '24');
  await expect(link.locator('svg')).toHaveAttribute('height', '24');
  await expect(page.locator('main')).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
  await expect(page.locator('main')).toHaveCSS('color', 'rgb(255, 255, 255)');
  const box = await page.locator('[data-wip-group]').boundingBox();
  const viewport = page.viewportSize()!;
  expect(
    Math.abs(box!.x + box!.width / 2 - viewport.width / 2),
  ).toBeLessThanOrEqual(4);
  expect(
    Math.abs(box!.y + box!.height / 2 - viewport.height / 2),
  ).toBeLessThanOrEqual(4);
  const textWidths = await page.locator('main').evaluate((main) => {
    const width = (selector: string) => {
      const range = document.createRange();
      range.selectNodeContents(main.querySelector(selector)!);
      return range.getBoundingClientRect().width;
    };
    return { heading: width('h1'), message: width('p') };
  });
  expect(Math.abs(textWidths.heading - textWidths.message)).toBeLessThanOrEqual(
    1,
  );
  const headingBox = await page.locator('main h1').boundingBox();
  const messageBox = await page.locator('main p').boundingBox();
  expect(messageBox!.y - headingBox!.y - headingBox!.height).toBeCloseTo(8, 1);
  const linkBox = await link.boundingBox();
  expect(linkBox!.y - messageBox!.y - messageBox!.height).toBeCloseTo(16, 1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const graph = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const [website, person] = JSON.parse(graph!)['@graph'];
  expect(website).toMatchObject({
    '@type': 'WebSite',
    name: 'antoniocamacho.dev',
    url: 'https://antoniocamacho.dev/',
  });
  expect(website.author['@id']).toBe(person['@id']);
  expect(person).toMatchObject({
    '@type': 'Person',
    name: 'Antonio Camacho Mira',
    sameAs: ['https://www.linkedin.com/in/antonio-camacho-mira/'],
  });
  expect(
    await page.locator('script:not([type="application/ld+json"])').count(),
  ).toBe(1);
  await expect(page.locator('script[type="module"]')).toHaveCount(1);
  const resources = await readInventory();
  await info.attach('initial-resources', {
    body: JSON.stringify(resources, null, 2),
    contentType: 'application/json',
  });
  assertBudget(resources);
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-width', '2px');
  await expect(link).toHaveCSS('outline-offset', '4px');
  await page.screenshot({
    path: `test-results/${info.project.name}-wip.png`,
    fullPage: true,
  });
  await page.route('https://www.linkedin.com/**', (route) =>
    route.fulfill({
      body: 'Profile navigation intercepted for offline testing.',
    }),
  );
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(
    'https://www.linkedin.com/in/antonio-camacho-mira/',
  );
});

test('browser color preference switches the page and focus colors without reload', async ({
  page,
}, info) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const link = page.getByRole('link');
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  for (const scheme of ['light', 'dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    const background =
      scheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
    const foreground =
      scheme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    for (const selector of ['body', 'main'])
      await expect(page.locator(selector)).toHaveCSS(
        'background-color',
        background,
      );
    for (const selector of ['main h1', 'main p'])
      await expect(page.locator(selector)).toHaveCSS('color', foreground);
    await expect(link).toHaveCSS('outline-color', foreground);
    await expect(link.locator('path')).toHaveCSS('fill', 'rgb(10, 102, 194)');
  }
  await page.screenshot({
    path: `test-results/${info.project.name}-wip-light.png`,
    fullPage: true,
  });
});

test('200% text remains readable and reachable without horizontal scrolling', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await expect(page.getByRole('heading', { name: 'WIP' })).toBeVisible();
  await expect(page.getByRole('link')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const box = await page.locator('[data-wip-group]').boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  const viewport = page.viewportSize()!;
  // Enlarged text stays centered whenever the group and approved padding fit.
  if (box!.height + 96 <= viewport.height) {
    expect(
      Math.abs(box!.y + box!.height / 2 - viewport.height / 2),
    ).toBeLessThanOrEqual(4);
  }
  expect(
    Math.abs(box!.x + box!.width / 2 - viewport.width / 2),
  ).toBeLessThanOrEqual(4);
});

test('resource guards reject oversized and external-resource fixtures', async ({
  page,
}) => {
  const read = inventory(page);
  await page.route('**/oversized.txt', (route) =>
    route.fulfill({ contentType: 'text/plain', body: 'x'.repeat(102_401) }),
  );
  await page.route('https://example.com/external.png', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg"/>',
    }),
  );
  await page.goto('/');
  await page.evaluate(async () => {
    await fetch('/oversized.txt');
  });
  const oversized = await read();
  expect(oversized.totalBytes).toBeGreaterThan(102_400);
  expect(() => assertBudget(oversized)).toThrow();
  await page.evaluate(async () => {
    const image = new Image();
    const done = new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });
    image.src = 'https://example.com/external.png';
    document.body.append(image);
    await done;
  });
  const withExternal = await read();
  expect(withExternal.external).toContain('https://example.com/external.png');
  expect(() => assertBudget({ ...withExternal, totalBytes: 0 })).toThrow();
});
