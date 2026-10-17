/** Replaceable public identity; no private CV fields belong in the published graph. */
export interface SiteIdentity {
  siteName: string;
  siteUrl: string;
  ownerName: string;
  linkedInUrl: string;
}
/** Construct the minimal connected Schema.org graph; reject non-HTTPS public URLs. */
export function buildStructuredData(identity: SiteIdentity) {
  for (const value of [identity.siteUrl, identity.linkedInUrl]) {
    if (new URL(value).protocol !== 'https:')
      throw new Error('Public identity URLs must use HTTPS');
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${identity.siteUrl}#website`,
        name: identity.siteName,
        url: identity.siteUrl,
        author: { '@id': `${identity.siteUrl}#person` },
      },
      {
        '@type': 'Person',
        '@id': `${identity.siteUrl}#person`,
        name: identity.ownerName,
        sameAs: [identity.linkedInUrl],
      },
    ],
  };
}
/** JSON remains parseable while user-provided text cannot close its HTML script container. */
export function serializeStructuredData(graph: unknown): string {
  return JSON.stringify(graph).replaceAll('<', '\\u003c');
}
