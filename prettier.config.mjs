/** Prettier owns formatting; checks and hooks never apply fixes implicitly. */
export default {
  singleQuote: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
