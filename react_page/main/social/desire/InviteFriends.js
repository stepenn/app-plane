import React, {Component} from 'react'
import Share from '../../../component/Dialog/Share'
import Toast from '../../../component/Toast'
import getDesireShareOption from './getDesireShareOption'
import css from './InviteFriends.less'

class InviteFriends extends Component {
  constructor(props) {
    super(props);
    this.img_plus = window.imgHost + '/images/img_addId.png';
  }

  render() {
    const {desire} = this.props
    return (
      <div className={css['invite-friends']} onClick={() => {
        Share.open((state, info) => {
          if (state) {
            Toast.showToast("分享成功");
          } else {
          }
        }, getDesireShareOption(desire), () => {
        })
      }}>
        <span className={css['invite-logo']} style={{
          backgroundImage: `url(${this.img_plus})`
        }}/>
        <span className={css['invite-text']}>邀请好友</span>
      </div>
    )
  }
}

module.exports = InviteFriends

