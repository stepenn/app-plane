import React, {Component} from 'react'
import css from './Button.less'
import classNames from './classNames'

class Button extends Component {
  constructor(props) {
    super(props);
    this.img_submit = window.imgHost + '/images/btn_submit.png';
    this.img_label = window.imgHost + '/images/bg_label.png';
  }
  render() {
    const { exotic, size } = this.props;
    let bgStyles = { backgroundImage: `url(${exotic != null && exotic !== false ? this.img_submit : this.img_label})` };
    const classes = classNames(
      css['btn'],
      css['btn--' + size]
    )
    return (
      <button className={classes} style={bgStyles} {...this.props}>{this.props.children}</button>
    )
  }
}

Button.defaultProps = {
  exotic: false,
  size: 'md'
}

module.exports = Button