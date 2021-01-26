export default function capitalize(str: string): string {
  return str.replace(
    /(\s|^)([^\s])/,
    (_, spacer, letter) => `${spacer}${letter.toUpperCase()}`,
  );
}
