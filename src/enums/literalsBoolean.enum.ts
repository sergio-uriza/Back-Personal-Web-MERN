export enum LiteralsBoolean {
  TRUE = 'true',
  FALSE = 'false',
}

export const literalToBoolean = (literal: LiteralsBoolean | undefined): boolean | undefined => {
  if (literal === LiteralsBoolean.TRUE) {
    return true
  } else if (literal === LiteralsBoolean.FALSE) {
    return false
  } else {
    return undefined
  }
}
