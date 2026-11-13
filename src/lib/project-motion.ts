const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function scrollPose(top: number, height: number, viewportHeight: number, mobile: boolean, reduced: boolean) {
  const travel = reduced ? 0 : clamp((viewportHeight / 2 - top - height / 2) / (viewportHeight * .65), -1, 1);
  const entering = clamp((top + (mobile ? 25 : 65) - viewportHeight / 2) / (viewportHeight / 2), 0, 1);
  return { travel, headingScale: reduced ? 1 : 1 + entering * (mobile ? .08 : .22) };
}
