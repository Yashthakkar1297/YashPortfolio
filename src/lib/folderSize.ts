// Every folder artwork gets the same visual size (equal area) inside an identical 1500 x 1250 slot, whatever its shape.
export const SLOT_ASPECT = 1500 / 1250;
export function folderWidthPct(aspect: number): string {
  return `${Math.min(100, (Math.sqrt(0.72 * 1500 * 1250 * aspect) / 1500) * 100).toFixed(1)}%`;
}
