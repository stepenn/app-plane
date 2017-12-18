/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';

import HelpI from '../../../help/Help.js';
import ContactsGraphContainer from './ContactsGraphContainer'
import DesireBox from './DesireBox'
import InviteFriends from './InviteFriends'
import Toast from '../../../component/Toast'
import HttpTool from '../../../http/HttpTool'
import {API_DEL_DESIRE, API_GET_DESIRE_DETAIL} from '../../../http/APIYHJ'
import CookieHelp from '../../../tool/CookieHelp'
import './polyfill'
import css from './Desire.less'

class DesireDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      desireDetail: null,
    }
    this.Help = new HelpI();
    this.img_contactBG = '/serverImg/img_contactsBG.png';
    this.openProfile = this.openProfile.bind(this)
  }

  openProfile(friendId) {
    const friendFrom = CookieHelp.getUserInfo().id
    this.Help.app_open(this, '/PersonDetail', {title: '个人中心', friendId, friendFrom})
  }

  getDesire() {
    return this.Help.app_getParameter(this).desire
  }

  componentDidMount() {
    const {id} = this.getDesire()
    if (!id) {
      Toast.showToast('愿望id获取失败')
      return
    }
    const onSuccess = (code, msg, data) => {
      this.setState({
        desireDetail: data,
      })
    }
    const onFailure = (code, msg) => {
      Toast.showToast(msg)
    }
    const params = {
      id,
    }
    HttpTool.post(API_GET_DESIRE_DETAIL, onSuccess, onFailure, params)
  }

  delDesire() {
    const {id} = this.getDesire()
    const onSuccess = (code, msg, json) => {
      this.Help.back(this)
      Toast.showToast('愿望删除成功')
    }
    const onFailure = (code, msg) => {
      Toast.showToast(msg)
    }
    const params = {
      id,
    }
    HttpTool.post(API_DEL_DESIRE, onSuccess, onFailure, params)
  }

  render() {
    const userInfo = CookieHelp.getUserInfo()
    const start = {
      id: userInfo.id,
      avatar: userInfo.avatar,
      nickname: userInfo.nick_name,
    }
    const div = (
      <div style={{height: '100%', padding: '0 .2rem'}}>
{/*
        <div style={{position: 'fixed'}}><Button onClick={() => {
          this.delDesire()
        }}>删除愿望</Button></div>
*/}
        <div style={{margin: '.4rem 0'}}>
          <DesireBox height={'4.5rem'}>
            <img src={this.img_contactBG} className={css['img']}/>
          </DesireBox>
        </div>

        <ContactsGraphContainer start={start} openProfile={this.openProfile} desireId={this.getDesire().id}/>

      </div>
    );
    const {desireDetail} = this.state
    const actionView = desireDetail ? <InviteFriends desire={desireDetail}/> : null
    return this.Help.app_render(this, div, {actionView});
  }
}
DesireDetail.contextTypes = {
  router: React.PropTypes.object
}
module.exports = DesireDetail;