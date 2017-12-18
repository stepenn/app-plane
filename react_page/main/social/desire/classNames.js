module.exports = function classNames(...classes) {
  const map = {}
  classes.forEach((clazz) => {
    if (!clazz) return
    if (typeof clazz === 'string') {
      map[clazz] = true
    }
    if (typeof clazz === 'object') {
      for (let className in clazz) {
        if (clazz[className] === true) {
          map[className] = true
        }
      }
    }
  })
  let joinedClasses = ''
  for (let className in map) {
    if (map[className] === true) joinedClasses += className + ' '
  }
  if (joinedClasses) {
    joinedClasses = joinedClasses.slice(0, -1)
  }
  return joinedClasses
}