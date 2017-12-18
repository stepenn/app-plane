import React, {Component} from 'react'
import css from './Label.less'
import classNames from './classNames'

class Label extends Component {
  constructor(props) {
    super(props);
    this.img_label = window.imgHost + '/images/bg_label.png';
  }
  render() {
    const {className, children} = this.props
    return (
      <span
        {...this.props} style={{
          backgroundImage: `url(${this.img_label})`
        }}
        className={classNames(className, css['label'])}
      >{children}</span>
    )
  }
}

module.exports = Label
