export const lineLength = (xa: number, ya: number, xb: number, yb: number) => Math.sqrt((xb - xa) ** 2 + (yb + ya) ** 2)

export const getPosAfterDistanceOnLine = (xa: number, ya: number, xb: number, yb: number, nextLength: number) => {
  const fullLength = lineLength(xa, ya, xb, yb)
  if (fullLength <= nextLength) return {
    x: xa,
    y: ya
  }

  const t = nextLength / fullLength
  return {
    x: ((1 - t) * xa + t * xb),
    y: ((1 - t) * ya + t * yb)
  }
}

// export const getPosAfterDistanceOnLine = (xa: number, ya: number, xb: number, yb: number, nextLength: number) => {
//   const fullLength = lineLength(xa, ya, xb, yb)
//   if (fullLength <= nextLength) return {
//     x: xa,
//     y: ya
//   }

//   const alternate = xb - xa
//   const theta = Math.acos(alternate / fullLength)

//   const internalY = Math.sin(theta) * nextLength
//   const internalX = Math.cos(theta) * nextLength

//   return {
//     x: precisionRound(xa + internalX, 2),
//     y: precisionRound(ya + internalY, 2)
//   }
// }

export const precisionRound = (x: number, precision: number) => Math.round(x * (10 ** precision)) / (10 ** precision)

export const circleCollision = (xa: number, ya: number, ra: number, xb: number, yb: number, rb: number): boolean => {
  const dx = xa - xb
  const dy = ya - yb
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < ra + rb) return true

  return false
}