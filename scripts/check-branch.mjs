import { cli, run } from './git-utils.mjs';
/** Exact owner-approved expression, including its permitted hyphen edge cases.
 * @param {string} name
 */
export function validBranch(name) {
  return (
    name === 'main' ||
    name === 'develop' ||
    /^(feat|fix|docs|test|ci|refactor|chore|perf|build)\/[a-z0-9-]+$/.test(name)
  );
}
cli(import.meta.url, () => {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--branch'))
    throw new Error('Usage: npm run lint:branch -- --branch NAME');
  const name = args.length
    ? args[1]
    : run('git', ['symbolic-ref', '--quiet', '--short', 'HEAD']).trim();
  if (!validBranch(name))
    throw new Error(
      'Invalid branch. Use TYPE/lowercase-kebab-name; main/develop are permanent exceptions. Detached CI must pass --branch NAME.',
    );
  console.log(`Branch accepted: ${name}`);
});
