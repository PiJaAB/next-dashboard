export default function areEqualShallow(
  a: Readonly<Record<string, unknown>>,
  b: Readonly<Record<string, unknown>>,
): boolean {
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((key) => a[key] === b[key])
  );
}
