export function toTextColorCss(value: string): string {
  const components = value.split(' ');
  const base = components.length > 0 ? `${components[0]}--text` : "";
  const modifier = components.length > 1 ? ` text--${components[1]}` : "";
  return base + modifier;
}