// @flow

export type ClassName = ?string | false | $ReadOnlyArray<?string | false>;

export default function toClassName(className: ClassName): ?string {
  if (typeof className === 'string') return className;
  if (!Array.isArray(className)) return null;
  return className.filter(Boolean).join(' ');
}
