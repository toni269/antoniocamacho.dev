import { expect, it } from 'vitest';
import { siteIdentity } from '../../src/content/site';
import {
  buildStructuredData,
  serializeStructuredData,
} from '../../src/lib/structured-data';

it('uses one replaceable public identity for website, owner and profile', () => {
  const parsed = JSON.parse(
    serializeStructuredData(buildStructuredData(siteIdentity)),
  );
  const [website, person] = parsed['@graph'];
  expect(website.name).toBe(siteIdentity.siteName);
  expect(website.url).toBe(siteIdentity.siteUrl);
  expect(website.author['@id']).toBe(person['@id']);
  expect(person.name).toBe(siteIdentity.ownerName);
  expect(person.sameAs).toEqual([siteIdentity.linkedInUrl]);
  expect(Object.keys(person).sort()).toEqual([
    '@id',
    '@type',
    'name',
    'sameAs',
  ]);
});
