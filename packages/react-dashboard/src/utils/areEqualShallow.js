// @flow
export default function areEqualShallow(
  a: { +[string]: mixed },
  b: { +[string]: mixed },
): boolean {
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every(key => a[key] === b[key])
  );
}
