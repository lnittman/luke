import { atom } from 'jotai'

export const logsSearchModalOpenAtom = atom(false)
export const logsSearchQueryAtom = atom('')
export const logsSearchSelectedIndexAtom = atom(0)
export const logsSearchDateRangeAtom = atom<{ from?: Date; to?: Date }>({})
