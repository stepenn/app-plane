import React, {Component} from 'react'
import classNames from './classNames'
import css from './Desire.less'

class Box extends Component {
  render() {
    let {className, sm, height} = this.props
    className = classNames(className, css['box'])
    return (
      <div
        {...this.props}
        className={className}
        style={{
          margin: sm != null ? '10px 20px' : 0,
          height,
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

module.exports = Box

