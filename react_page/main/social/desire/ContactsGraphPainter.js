import React from 'react'
import shallowCompare from 'react/lib/shallowCompare'
import ContactsGraph from './ContactsGraph'
import {innerWidth, innerHeight} from './innerSize'
import {timer} from 'd3-timer'

function intDiv(a, b) {
  return Math.floor(a / b)
}

function advance(start, step, limit) {
  if (limit <= 0) throw new Error('Illegal value of limit')
  start += step
  start %= limit
  if (start < 0) {
    start += limit
  }
  return start
}

let _isHighEnough = null
function isHighEnough() {
  if (!_isHighEnough) {
    _isHighEnough = innerHeight / innerWidth > 1.7
  }
  return _isHighEnough
}

function getSize() {
  return {
    width: innerWidth,
    height: isHighEnough() ? innerWidth : Math.floor(innerWidth * 0.9),
  }
}

function getGraphStyle() {
  return Object.assign({
    position: 'fixed',
    bottom: 0,
    left: 0,
  }, getSize())
}

function getMaxNumberOnRound() {
  return isHighEnough() ? 20 : 16
}

function getMaxVisible() {
  return isHighEnough() ? 5 : 4
}

const maxShowAll = 7

function getMasterRadius() {
  return isHighEnough() ? 55 : 50
}

function getSlaveRadius() {
  return isHighEnough() ? 30 : 25
}

function getParentRadius() {
  return 15
}

class ContactsGraphPainter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      radius: this.calcRadius(props),
      tweeningRadius: 0,
      rotation: 0,
      index: 0,
      indexOfRound: 0,
    }
    this.magicFlag = false
    this.currentSlaves = null
    this.lastTouch = {
      clientX: null,
      clientY: null
    }
    this.cacheBack = true
    this.stateCache = []
    this.eventEmitter = {}
    this.onRotate = this.onRotate.bind(this)
  }

  componentDidMount() {
    this.tweenRadius()

    this.subscribe('update', ({forward}) => {
      this.updateSecretly(forward)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.master === nextProps.master) return
    this.currentSlaves = null
    if (this.cacheBack) {
      let savedState = null
      if (nextProps.backward) {
        savedState = this.restoreState(nextProps.master.id)
      }
      if (savedState) {
        const {magicFlag} = savedState
        this.magicFlag = magicFlag
        delete savedState.magicFlag
        this.setState(savedState, () => {
          this.tweenRadius()
        })
      } else {
        this.saveState(this.props.master.id)
        this._setStateWithoutCache(nextProps)
      }
    } else {
      this._setStateWithoutCache(nextProps)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  updateSecretly(forward) {
/*
    requestAnimationFrame(() => {
      this.setState((prevState) => {
        let {index, indexOfRound} = prevState
        const shouldExtend = this.shouldExtend()
        const step = (getMaxNumberOnRound() - getMaxVisible()) * (forward ? 1 : -1)
        if (shouldExtend) {
          index = advance(index, step, this.getExtendedLength())
        } else {
          index = advance(index, step, this.props.slaves.length)
        }
        indexOfRound = advance(indexOfRound, step, getMaxNumberOnRound())

        this.currentSlaves = null
        return {
          index,
          indexOfRound,
        }
      })
    })
*/
    let {index, indexOfRound} = this.state
    const shouldExtend = this.shouldExtend()
    const step = (getMaxNumberOnRound() - getMaxVisible()) * (forward ? 1 : -1)
    if (shouldExtend) {
      index = advance(index, step, this.getExtendedLength())
    } else {
      index = advance(index, step, this.props.slaves.length)
    }
    indexOfRound = advance(indexOfRound, step, getMaxNumberOnRound())
    this.setIndexAndIndexOfRound({index, indexOfRound})
  }

  setIndexAndIndexOfRound({index, indexOfRound}) {
    this.currentSlaves = null
    this.state = Object.assign({}, this.state, {index, indexOfRound})
    this.graph.props = Object.assign({}, this.graph.props, {slaves: this.getSlavesToShow()})
    this.graph.updateSlavesDirectly()
  }

  shouldExtend() {
    const {slaves} = this.props
    return slaves.length > maxShowAll && slaves.length < getMaxNumberOnRound()
  }

  getExtendedLength() {
    const len = this.props.slaves.length
    const maxLen = getMaxNumberOnRound()
    return Math.ceil(maxLen / len) * len
  }

  saveState(id) {
    const state = Object.assign({}, this.state, {id, magicFlag: this.magicFlag})
    this.stateCache.push(state)
  }

  restoreState(id) {
    const index = this.stateCache.findIndex(state => state.id === id)
    if (index >= 0) {
      this.stateCache.splice(index + 1)
      const state = this.stateCache.pop()
      delete state.id
      return state
    } else {
      return null
    }
  }

  _setStateWithoutCache(nextProps) {
    this.setState({
      radius: this.calcRadius(nextProps),
      tweeningRadius: 0,
      rotation: 0,
      index: 0,
      indexOfRound: 0,
    }, () => {
      this.tweenRadius()
    })
    this.magicFlag = false
    this.currentSlaves = null
  }

  emit(type, data) {
    const listeners = this.eventEmitter[type]
    if (listeners && listeners.length) {
      for (let listener of listeners) {
        listener(data)
      }
    }
  }

  subscribe(type, listener) {
    if (!this.eventEmitter[type]) {
      this.eventEmitter[type] = []
    }
    this.eventEmitter[type].push(listener)
  }

  getSlavesToShow() {
    if (this.canShowAll(this.props)) return this.props.slaves
    if (this.currentSlaves) return this.currentSlaves
    const res = []
    const len = getMaxNumberOnRound()
    const {
      slaves
    } = this.props
    const {
      index,
      indexOfRound,
    } = this.state
    for (let i = 0; i < len; i++) {
      res[(i + indexOfRound) % len] = slaves[(i + index) % slaves.length]
    }
    return this.currentSlaves = res
  }

  canShowAll(props) {
    return props.slaves.length <= maxShowAll
  }

  tweenRadius() {
    const jsAnimation = () => {
      const {radius, tweeningRadius} = this.state
      const deltaRadius = radius - tweeningRadius
      const duration = 320
      const startTime = +new Date()
      const step = () => {
        const now = +new Date()
        const ratio = (now - startTime) / duration
        if (ratio >= 1) {
          this.setState({tweeningRadius: radius})
        } else {
          this.setRadius(ratio * (2 - ratio) * deltaRadius + tweeningRadius)
          requestAnimationFrame(step)
        }
      }
      step()
    }

    this.setState(({radius}) => {
      return {
        tweeningRadius: radius / 2,
      }
    }, jsAnimation)
  }

  setRadius(radius) {
    /*
     this.setState({
     tweeningRadius: radius,
     })
     */
    this.state = Object.assign({}, this.state, {tweeningRadius: radius})
    this.graph.props = Object.assign({}, this.graph.props, {radius: radius})
    this.graph.updateSlavesPositionDirectly()
  }

  tweenRotation(deltaRotation) {
    const {rotation} = this.state
    let step = 25 / this.state.radius
    if (deltaRotation > step || deltaRotation < -step) {
      step = deltaRotation > 0 ? step : -step
      const n = Math.floor(deltaRotation / step)
      let i = 0
      const animLoop = () => {
        if (i >= n) {
          this.setRotation(this.state.rotation + (deltaRotation - n * step))
          t.stop()
        } else {
          this.setRotation(this.state.rotation + step)
          i++
        }
      }
      var t = timer(animLoop)
    } else {
      this.setRotation(rotation + deltaRotation)
    }
  }

  // 仅在tweenRotation方法中使用
  setRotation(newRotation) {
/*
    this.setState((prevState) => {
      const {rotation} = prevState
      this.emitUpdateIfNecessary(rotation, newRotation)
      return {
        rotation: newRotation,
      }
    })
*/

    this.emitUpdateIfNecessary(this.state.rotation, newRotation)
    // 遭遇setState性能瓶颈，改用手动更新DOM
    this.state = Object.assign({}, this.state, {rotation: newRotation})
    // this.props.rotation = newRotation + this.getStartRadian()
    this.graph.props = Object.assign({}, this.graph.props, {rotation: newRotation + this.getStartRadian()})
    this.graph.updateSlavesPositionDirectly()
  }

  emitUpdateIfNecessary(rotationBefore, rotationAfter) {
    const period = this.getUpdatePeriod()
    if (period) {
      const a = intDiv(rotationBefore, period)
      const b = intDiv(rotationAfter, period)
      if (
        (b - a === 1 && b > 0) ||
        (b - a === 1 && b < 0)
      ) {
        this.emit('update', {forward: false})
      } else if (
        (b - a === -1 && a < 0) ||
        (b - a === -1 && a > 0)
      ) {
        this.emit('update', {forward: true})
      } else if (rotationBefore <= 0 && b === 0) {
        this.magicFlag = true
        this.emit('update', {forward: false})
      } else if (this.magicFlag && rotationBefore >= 0 && b === -1) {
        this.magicFlag = false
        this.emit('update', {forward: true})
      }
    }

  }

  onRotate(rotation) {
    this.tweenRotation(rotation)
  }

  getUpdatePeriod() {
    return this.canShowAll(this.props) ? null : Math.PI * 2 * (1 - getMaxVisible() / getMaxNumberOnRound())
  }

  calcRadius(props) {
    let radius
    if (isHighEnough()) {
      if (this.canShowAll(props)) {
        radius = (getSize().width / 2 - getSlaveRadius()) - getSlaveRadius() / 2
      } else {
        radius = (getSize().width - getSlaveRadius()) - getSlaveRadius() * 2
      }
    } else {
      if (this.canShowAll(props)) {
        radius = (getSize().height / 2 - getSlaveRadius()) - getSlaveRadius() / 2
      } else {
        radius = (getSize().height - getSlaveRadius()) - getSlaveRadius() * 2
      }
    }
    return radius
  }

  getCenter() {
    if (isHighEnough()) {
      if (this.canShowAll(this.props)) {
        return {
          x: getSize().width / 2,
          y: getSize().height / 2,
        }
      } else {
        return {
          x: getSize().width - getSlaveRadius() * 1.5,
          y: getSize().height - getSlaveRadius() * 1.5,
        }
      }
    } else {
      if (this.canShowAll(this.props)) {
        return {
          x: getSize().width / 2,
          y: getSize().height / 2,
        }
      } else {
        return {
          x: getSize().width - getSlaveRadius() * 1.5,
          y: getSize().height - getSlaveRadius() * 1.5,
        }
      }
    }
  }

  getMasterOffset() {
    if (this.canShowAll(this.props)) {
      return {
        offsetX: 0,
        offsetY: 0,
      }
    } else {
      return {
        offsetX: -getMasterRadius(),
        offsetY: -getMasterRadius(),
      }
    }
  }

  getStartRadian() {
    return this.canShowAll(this.props) ? -Math.PI / 2 : -Math.PI
  }

  render() {
    const {
      master,
      parents,
    } = this.props
    const {
      tweeningRadius,
      rotation,
    } = this.state
    const showAll = this.canShowAll(this.props)
    const shownSlaves = this.getSlavesToShow()

    return (
      <div>
{/*
        <div style={{
          position: 'fixed',
          top: 100,
          left: 0,
          right: 0,
          padding: '5px 30px',
          wordWrap: 'break-word',
        }}>
          <div>{this.props.slaves.length}</div>
          {
            this.props.slaves.map((slave) => <span key={slave.id}>{slave.nickname}:</span>)
          }
        </div>
*/}
        <ContactsGraph
          ref={(graph) => { this.graph = graph }}
          key={master.id}
          radius={tweeningRadius}
          masterRadius={getMasterRadius()}
          slaveRadius={getSlaveRadius()}
          parentRadius={getParentRadius()}
          graphStyle={getGraphStyle()}
          center={this.getCenter()}
          masterOffset={this.getMasterOffset()}
          rotation={rotation + this.getStartRadian()}
          master={master}
          parents={parents}
          slaves={shownSlaves}
          showAll={showAll}
          onRotate={this.onRotate}
          nextContacts={this.props.nextContacts}
          prevContacts={this.props.prevContacts}
          viewProfile={this.props.viewProfile}
        />

      </div>
    )
  }
}

module.exports = ContactsGraphPainter