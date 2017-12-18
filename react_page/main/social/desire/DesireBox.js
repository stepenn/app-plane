import React, {Component} from 'react'
import classNames from './classNames'
import css from './Desire.less'

class DesireBox extends Component {
  constructor(props) {
    super(props);
    this.img_bgBox = window.imgHost + '/images/bg_box.png';
  }
  render() {
    let {className, height, width} = this.props
    className = classNames(className, css['desire-box'])
    return (
      <div {...this.props}
        className={className}
        style={{
          width,
          height,
          backgroundImage: `url(${this.img_bgBox})`
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

module.exports = DesireBox

