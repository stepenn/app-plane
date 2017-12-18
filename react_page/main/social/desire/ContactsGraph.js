import React, {Component} from 'react'
import css from './ContactsGraph.less'
import shallowCompare from 'react/lib/shallowCompare'
import {innerWidth, innerHeight} from './innerSize'
import {select, event} from 'd3-selection'
import {drag} from 'd3-drag'

function getTranslateValue(x, y) {
  return `translate(${x}, ${y})`
}

function encodeID(id) {
  if (!id) return ''
  return id.replace(/[/:]/g, '_')
}

function calcRadian(x, y) {
  if (x === 0) {
    return y > 0 ? Math.PI / 2 : Math.PI / 2 * 3
  }
  if (y === 0) {
    return x > 0 ? 0 : Math.PI
  }
  let radian = Math.atan(y / x)
  if (y > 0 && x > 0) {

  } else if (y > 0 && x < 0) {
    radian += Math.PI
  } else if (y < 0 && x > 0) {
    radian += Math.PI * 2
  } else {
    radian += Math.PI
  }
  return radian
}

function getRotation(from, to, center) {
  const {x: fromX, y: fromY} = from
  const {x: toX, y: toY} = to
  const {x, y} = center
  const fromRadian = calcRadian(fromX - x, fromY - y)
  const toRadian = calcRadian(toX - x, toY - y)
  let deltaRadian = toRadian - fromRadian
  if (deltaRadian > Math.PI) {
    deltaRadian -= Math.PI * 2
  } else if (deltaRadian < -Math.PI) {
    deltaRadian += Math.PI * 2
  }
  return deltaRadian
}

class Avatar extends Component {
  constructor(props) {
    super(props)
  }

  // 避免旋转时的reconciliation
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {r, url} = this.props
    const id = encodeID(url)
    return (
      <g>
        <defs>
          <pattern
            id={id}
            width="100%"
            height="100%"
            patternContentUnits="objectBoundingBox"
          >
            <image
              xlinkHref={url}
              width={1}
              height={1}
              preserveAspectRatio="none"
            />
          </pattern>
        </defs>
        <circle
          className="avatar"
          r={r - 2}
          fill={`url(#${url ? id : 'default-avatar'})`}
        />
        <circle
          r={r}
          fill="url(#avatar-outline)"
        />
      </g>
    )
  }
}

class ContactsGraph extends Component {
  constructor(props) {
    super(props)
    this.radians = null
    this.state = {
      activeMenu: null,
      menuPosition: null,
    }
    this.closeMenu = this.closeMenu.bind(this)
    this.svgTouchStart = this.svgTouchStart.bind(this)
    this.svgTouchMove = this.svgTouchMove.bind(this)

    this.img_headRing = window.imgHost + '/images/bg_head_ring.png';
    this.img_bgGraph = window.imgHost + '/images/bg_graph.png';
    this.img_doubleArrow = window.imgHost + '/images/img_doubleArrow.png';
    this.img_curContact = window.imgHost + '/images/contacts_current.png';
    this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
  }

  componentDidMount() {
    window.addEventListener('click', this.closeMenu)
    select(this.svgNode).call(
      drag()
        .container(this.svgNode)
        .on('start', this.svgTouchStart)
        .on('drag', this.svgTouchMove)
    )
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeMenu)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.slaves.length !== nextProps.slaves.length) {
      this.radians = null
    }
    if (this.props.master !== nextProps.master) {
      this.setState({activeMenu: null})
    }
  }

  render() {
    const {slaves, nextContacts, viewProfile, graphStyle} = this.props
    const {activeMenu, menuPosition} = this.state
    return (
      <div>
        <svg
          ref={(svgNode) => { this.svgNode = svgNode }}
          style={graphStyle}
        >
          <defs>
            <pattern
              id="avatar-outline"
              width="100%"
              height="100%"
              patternContentUnits="objectBoundingBox"
            >
              <image
                xlinkHref={this.img_headRing}
                preserveAspectRatio="none"
                width="1"
                height="1"
              />
            </pattern>
            <pattern
              id="default-avatar"
              width="100%"
              height="100%"
              patternContentUnits="objectBoundingBox"
            >
              <image
                xlinkHref={this.img_defaultAvatar}
                preserveAspectRatio="none"
                width={1}
                height={1}
              />
            </pattern>

          </defs>
          <g>
            {/*{this.renderBg()}*/}
            {this.renderSlaves()}
            {this.renderMaster()}
            {this.renderParents()}
          </g>
        </svg>
        {
          activeMenu != null &&
          <Menu
            style={Object.assign({position: 'fixed'}, menuPosition)}
            slave={slaves[activeMenu]}
            viewContacts={nextContacts}
            viewProfile={viewProfile}
            handleClose={this.closeMenu}
          />
        }
      </div>
    )
  }

  renderBg() {
    const {x, y} = this.props.center
    const r = x - (this.props.showAll ? 20 : 0)
    return (
      <image
        xlinkHref={this.img_bgGraph}
        preserveAspectRatio="none"
        width={r * 2}
        height={r * 2}
        transform={getTranslateValue(x - r, y - r)}
      />
    )
  }

  renderMaster() {
    const {x, y} = this.props.center
    const {offsetX, offsetY} = this.props.masterOffset
    const {masterRadius, master} = this.props
    return (
      <g
        transform={getTranslateValue(x + offsetX, y + offsetY)}
      >
        <Avatar
          r={masterRadius}
          url={master.avatar}
        />
        {/*<text>{master.nickname}</text>*/}
      </g>
    )
  }

  renderSlave(radian, i) {
    const {slaveRadius, slaves} = this.props

    // ContactsGraphPainter可能会扩展slaves数据，
    // 因此slaves中可能存在相同id的项目。
    // 若使用slave的id作为key，会导致有些slave无法渲染。
    return (
      <g
        key={i}
        transform={this.getSlaveTransform(radian)}
        onClick={(e) => {
          e.stopPropagation()
          this.props.viewProfile(slaves[i])
/*
          const rect = e.currentTarget.getBoundingClientRect()
          if (this.state.activeMenu == i) {
            this.closeMenu()
          } else {
            this.showMenu(i, rect)
          }
*/
        }}
      >
        <Avatar
          r={slaveRadius}
          url={slaves[i].avatar}
        />
       </g>
    )
  }

  renderSlaves() {
    return (
      <g
        key="slaves"
        ref={(slavesNode) => { this.slavesNode = slavesNode }}
      >
        {
          this.getRadians().map((radian, i) => {
            return (
              this.renderSlave(radian + this.props.rotation, i)
            )
          })
        }
      </g>
    )
  }

  renderParents() {
    if (!this.props.parents || !this.props.parents.length) return
    const {parentRadius} = this.props
    const arrowSize = 16
    const padding = 2
    const parents = this.props.parents.map((parent, i) => {
      // 使用索引作为key，因为可能需要渲染相同id的parent
      return (
        <g
          key={i}
          transform={getTranslateValue((parentRadius * 2 + arrowSize) * i, 0)}
          onClick={() => {
            this.props.prevContacts(parent)
          }}
        >
          <Avatar
            r={parentRadius}
            url={parent.avatar}
          />
          {
            i === this.props.parents.length - 1 &&
            <image
              xlinkHref={this.img_curContact}
              preserveAspectRatio="none"
              width="8"
              height="8"
              transform={getTranslateValue(-4, parentRadius + 4)}
            />
          }
        </g>
      )
    })
    const children = []
    for (let i = 0; i < parents.length; i++) {
      const arrow = (
        <g
          key={'arrow' + i}
          width={arrowSize}
          height={arrowSize}
          transform={getTranslateValue(parentRadius + padding + (parentRadius * 2 + arrowSize) * (i - 1), -arrowSize / 2 + padding)}
        >
          <image
            preserveAspectRatio="none"
            width={12}
            height={12}
            xlinkHref={this.img_doubleArrow}
          />
        </g>
      )
      if (i > 0) children.push(arrow)
      children.push(parents[i])
    }
    return (
      <g
        key="parents"
        transform={getTranslateValue(parentRadius * 2, parentRadius)}
      >
        {children}
      </g>
    )
  }

  svgTouchStart() {
    this.lastPoint = {
      x: event.x,
      y: event.y
    }
  }

  svgTouchMove() {
     const point = {
      x: event.x,
      y: event.y
    }
    const rotation = getRotation(this.lastPoint, point, this.props.center)
    this.lastPoint = point
    this.props.onRotate(rotation)
  }

  closeMenu() {
    if (this.state.activeMenu != null) {
      this.setState({
        activeMenu: null,
        menuPosition: null,
      })
    }
  }

  showMenu(i, rect) {
    const {top, right, bottom, left} = rect
    const menuPosition = {}
    const menuWidth = 140
    const menuHeight = 60
    if (innerHeight - bottom > menuHeight + 10) {
      menuPosition.top = bottom
    } else {
      menuPosition.bottom = innerHeight - top
    }
    if (innerWidth - left > menuWidth + 10) {
      menuPosition.left = left
    } else {
      menuPosition.right = innerWidth - right
    }
    this.setState({
      activeMenu: i,
      menuPosition: menuPosition,
    })
  }

  getRadians() {
    if (this.radians) return this.radians
    const {slaves} = this.props
    const len = slaves.length
    const {PI} = Math
    const radians = []
    for (let i = 0; i < len; i++) {
      radians.push(PI * 2 / len * i)
    }
    return this.radians = radians
  }

  getSlaveTransform(radian) {
    const {x, y} = this.props.center
    const {radius} = this.props
    const translateX = radius * Math.cos(radian) + x
    const translateY = radius * Math.sin(radian) + y
    return getTranslateValue(translateX, translateY)
  }

  updateSlavesPositionDirectly() {
    const {rotation} = this.props
    const slaveNodes = this.slavesNode.children
    this.getRadians().forEach((radian, i) => {
      slaveNodes[i].setAttribute('transform', this.getSlaveTransform(radian + rotation))
    })
  }

  updateSlavesDirectly() {
    const {slaves} = this.props
    const slaveNodes = this.slavesNode.children
    for (let i = 0; i < slaveNodes.length; i++) {
      const url = slaves[i].avatar
      const id = encodeID(url)
      slaveNodes[i].querySelector('pattern').setAttribute('id', id)
      slaveNodes[i].querySelector('image').setAttribute('xlink-href', url)
      slaveNodes[i].querySelector('circle').setAttribute('fill',`url(#${url ? id : 'default-avatar'})`)
    }
  }
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.img_contact = window.imgHost + '/images/img_group.png';
    this.img_profile = window.imgHost + '/images/icon_userInfo.png';
  }
  render() {
    const {slave, viewContacts, viewProfile, handleClose} = this.props
    return (
        <div className={css['menu']} {...this.props}>
          <div className={css['menu-item']} onClick={
            (e) => {
              if (typeof handleClose === 'function') {
                handleClose()
              }
              viewContacts(slave)
            }
          }>
            <span>Ta的人脉</span>
            <span className={css['btn-view-contacts']} style={{
              backgroundImage: `url(${this.img_contact})`
            }}/>
          </div>
          <div className={css['menu-item']} onClick={
            (e) => {
              if (typeof handleClose === 'function') {
                handleClose()
              }
              viewProfile(slave)
            }
          }>
            <span>查看资料</span>
            <span className={css['btn-view-profile']} style={{
              backgroundImage: `url(${this.img_profile})`
            }}/>
          </div>
        </div>
    )
  }
}

module.exports = ContactsGraph