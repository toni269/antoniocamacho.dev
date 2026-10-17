import { expect, it } from 'vitest';
import {
  buildStructuredData,
  serializeStructuredData,
} from '../../src/lib/structured-data';

const identity = {
  siteName: 'Example portfolio',
  siteUrl: 'https://example.com/',
  ownerName: 'Example Owner',
  linkedInUrl: 'https://www.linkedin.com/in/example/',
};

it('links the website to its owner and the confirmed external identity', () => {
  const graph = buildStructuredData(identity);
  expect(graph['@context']).toBe('https://schema.org');
  expect(graph['@graph']).toHaveLength(2);
  expect(graph['@graph'][0]).toMatchObject({
    '@type': 'WebSite',
    '@id': 'https://example.com/#website',
    name: identity.siteName,
    author: { '@id': 'https://example.com/#person' },
  });
  expect(graph['@graph'][1]).toMatchObject({
    '@type': 'Person',
    name: identity.ownerName,
    sameAs: [identity.linkedInUrl],
  });
});
it('keeps fork text round-trippable without permitting script termination', () => {
  const graph = buildStructuredData({
    ...identity,
    ownerName: '</script><script>alert(1)</script>',
  });
  const serialized = serializeStructuredData(graph);
  expect(serialized).not.toContain('<');
  expect(JSON.parse(serialized)).toEqual(graph);
});
it('rejects malformed or executable identity URLs', () => {
  expect(() =>
    buildStructuredData({ ...identity, siteUrl: 'not a URL' }),
  ).toThrow();
  expect(() =>
    buildStructuredData({ ...identity, linkedInUrl: 'javascript:alert(1)' }),
  ).toThrow();
});
