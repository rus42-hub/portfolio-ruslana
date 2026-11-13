export function smoothMotion(current: number, target: number, delta: number, snap = false, timeConstant = 120) {
  const next = snap ? target : target + (current - target) * Math.exp(-delta / timeConstant);
  return Math.abs(next - target) < .0001 ? target : next;
}
