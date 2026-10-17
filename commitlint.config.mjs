// Validate contributor messages, including merge-like text, rather than silently ignoring it.
export default {
  extends: ['@commitlint/config-conventional'],
  defaultIgnores: false,
};
