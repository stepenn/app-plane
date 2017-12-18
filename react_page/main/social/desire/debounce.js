module.exports = function debounce(callback, timeout) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(
      () => {
        callback(...args)
      },
      timeout
    )
  }
}