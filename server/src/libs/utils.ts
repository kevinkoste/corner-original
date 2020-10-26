export const processSiteTitle = (s: string) => {
  const split = s.split(/: | ; | \| | _ | - | –/)
  split.sort((a, b) => a.length - b.length)
  const filtered = split.filter((str) => str !== '')
  return filtered[0]
}

export const getModeAndFreq = (arr: string[]) => {
  const numMapping: { [index: string]: number } = {}
  let greatestFreq: number = 0
  let mode: string = ''
  arr.forEach((num: string) => {
    numMapping[num] = (numMapping[num] || 0) + 1
    if (greatestFreq < numMapping[num]) {
      greatestFreq = numMapping[num]
      mode = num
    }
  })
  return {
    mode,
    greatestFreq,
  }
}
