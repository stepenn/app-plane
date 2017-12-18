let innerWidth = null
let innerHeight = null

function fresh() {
  innerWidth = window.innerWidth
  innerHeight = window.innerHeight
}

fresh()

module.exports = {
  get innerWidth() {
    return innerWidth
  },
  get innerHeight() {
    return innerHeight
  },
  fresh,
}