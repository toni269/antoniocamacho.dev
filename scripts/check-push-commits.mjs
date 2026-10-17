import { readFileSync } from 'node:fs';
import { cli, run, tool } from './git-utils.mjs';
const zero = /^0+$/;
/** Validate every outgoing message, using the remote's advertised history on first pushes.
 * Input is Git pre-push stdin: local-ref local-sha remote-ref remote-sha per line.
 * Never fetch/mutate history implicitly or expose credential-bearing remote addresses.
 */
cli(import.meta.url, () => {
  const updates = readFileSync(0, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const fields = line.trim().split(/\s+/);
      if (
        fields.length !== 4 ||
        !fields[1] ||
        !fields[3] ||
        ![fields[1], fields[3]].every((sha) => /^[a-f0-9]{40,64}$/.test(sha))
      )
        throw new Error(
          'Invalid pre-push ref input. Run this command through the Git pre-push hook.',
        );
      return { local: fields[1], remote: fields[3] };
    })
    .filter((update) => !zero.test(update.local));
  if (!updates.length) return;
  if (run('git', ['rev-parse', '--is-shallow-repository']).trim() === 'true')
    throw new Error(
      'Shallow history cannot prove the outgoing range; fetch complete history and retry.',
    );
  const remoteName = process.argv[2];
  if (!remoteName || remoteName.startsWith('-'))
    throw new Error('Missing remote name for outgoing commit validation.');
  /** @type {string[] | undefined} */
  let advertised;
  const commits = new Set();
  for (const update of updates) {
    let bases = [update.remote];
    if (zero.test(update.remote)) {
      if (!advertised) {
        // Hide Git diagnostics here: a remote URL may contain credentials.
        try {
          advertised = run('git', [
            'ls-remote',
            '--refs',
            '--heads',
            '--tags',
            remoteName,
          ])
            .split('\n')
            .filter(Boolean)
            .map((line) => line.split(/\s+/)[0]);
        } catch {
          throw new Error(
            'Cannot read advertised remote history. Check remote access and retry.',
          );
        }
      }
      bases = advertised;
    }
    for (const base of bases) {
      try {
        run('git', ['cat-file', '-e', `${base}^{commit}`]);
      } catch {
        throw new Error(
          'Outgoing history is unavailable locally; fetch complete remote branch/tag history and retry.',
        );
      }
    }
    for (const sha of run('git', [
      'rev-list',
      update.local,
      ...bases.map((base) => `^${base}`),
    ])
      .trim()
      .split('\n')
      .filter(Boolean))
      commits.add(sha);
  }
  for (const sha of commits)
    tool(
      '@commitlint/cli/cli.js',
      [],
      run('git', ['show', '-s', '--format=%B', sha]),
    );
  console.log(`Validated ${commits.size} outgoing commit messages.`);
});
