export function roundToTwoDecimals(num: number) {
  return +(Math.round(+(num + 'e+2')) + 'e-2');
}
