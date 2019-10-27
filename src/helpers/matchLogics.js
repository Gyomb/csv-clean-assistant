export const formatFlags = (options = {}) => {
  const supportedFlags = [
    ['caseSensitive', 'i', false],
    ['global', 'g', true]
  ]
  let flags = []
  supportedFlags.forEach(flag => {
    if (!!options[flag[0]] === flag[2]) flags.push(flag[1])
  })
  return flags.join('')
}
