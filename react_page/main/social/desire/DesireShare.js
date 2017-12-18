import React, {Component} from 'react'
import HelpI from '../../../help/Help';
import Toast from '../../../component/Toast';
import CookieHelp from '../../../tool/CookieHelp'
import HttpTool from '../../../http/HttpTool';
import Loading from '../../../component/Dialog/Loading'
import {
  API_ACCOUNT_GET_CODE,
  API_CHECK_JOIN_DESIRE,
  API_JOIN_DESIRE_USER,
  API_ADD_DESIRE_REGISTER,
  API_GET_DESIRE_DETAIL,
} from '../../../http/APIYHJ';
import css from './DesireShare.less'

const img_QR = 'https://app.apin.com/getqrcode?text=https%3a%2f%2fapp.apin.com%2fapp%2fdown%2fdownload.html'
const img_shareCity = '/serverImg/img_shareCity.jpg'
const bg_shareCityMask = window.imgHost + '/images/bg_shareCityMask.png'
const bg_wannaGo = window.imgHost + '/images/bg_wannaGo.png'

let requestCount = 0
function requestStart() {
  requestCount++
  if (requestCount > 0) {
    Loading.show(true)
  }
}

function requestEnd() {
  requestCount--
  if (requestCount === 0) {
    Loading.show(false)
  }
}

class DesireShare extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobile: '',
      code: '',
      count: 0,
      isSendingCode: false,
      showDialog: false,
      joined: null,
      isJoining: false,
      isNewUser: true,
      city: '',
    }
    this.helper = new HelpI()
      this.helper.setPageAnimOption(null);
    this.sendCode = this.sendCode.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleJoin = this.handleJoin.bind(this)
  }

  componentDidMount() {
    this.checkJoined()
    this.getDesireDetail()
  }

  renderDialog() {
    if (this.state.joined == null) return null
    if (this.state.joined) {
      return (
        <Dialog>
          <div className={css['dialog_text-row']} style={{paddingTop: '.5rem'}}>
            {
              this.state.isNewUser ? '您已成为爱拼机用户' : '您已加入好友愿望'
            }
          </div>
          <div className={css['dialog_text-row']}>赶紧下载APP</div>
          <div className={css['dialog_text-row']}>与好友一起实现愿望吧</div>
          <div className={css['dialog_submit-row']}>
            <div
              className={css['dialog_btn-submit']}
              onClick={() => { location.href = '/app/down/download.html' }}
            >下载</div>
          </div>
        </Dialog>
      )
    } else {
      return (
        <Dialog didLoad={() => { this.mobileInput.focus() }}>
          <div className={css['dialog_title']}>填写手机号，一起来加入愿望</div>
          <form action="">
            <div className={css['dialog_input-row']}>
              <input
                ref={(mobileInput) => { this.mobileInput = mobileInput }}
                type="text"
                name="mobile"
                placeholder="请输入手机号"
                value={this.state.mobile}
                onChange={this.handleChange}
              />
              {
                this.state.count === 0 ?
                  <span
                    className={css['dialog_btn-code']}
                    onClick={this.state.mobile ? this.sendCode : null}
                    style={{
                      opacity: this.state.mobile ? 1 : .3
                    }}
                  >获取验证码</span> :
                  <span className={css['dialog_count-down']}>{this.state.count}秒可重发</span>
              }
            </div>
            <div className={css['dialog_input-row']}>
              <input
                ref={(codeInput) => { this.codeInput = codeInput }}
                type="text"
                name="code"
                placeholder="请输入验证码"
                value={this.state.code}
                onChange={this.handleChange}
              />
            </div>
            <div className={css['dialog_submit-row']}>
              <div
                className={css['dialog_btn-submit']}
                style={{
                  opacity: this.state.mobile && this.state.code ? 1 : .3
                }}
                onClick={this.state.mobile && this.state.code ? this.handleJoin : null}>加入愿望</div>
            </div>
          </form>

        </Dialog>
      )
    }
  }

  render() {
    let wannaGo = null
    if (this.state.joined == true) {
      wannaGo = (
        <div className={css['wanna-go']} style={{backgroundImage: `url("${bg_wannaGo}")`}}>您已加入好友愿望</div>
      )
    } else {
      wannaGo = (
        <div
          className={css['wanna-go']}
          style={{backgroundImage: `url("${bg_wannaGo}")`}}
          onClick={() => {
            const userInfo = this.getUserInfo()
            if (userInfo) {
              this.joinForLogined()
            } else {
              this.setState({showDialog: true})
            }
          }}
        >我也想去</div>
      )
    }
    return (
      <div className={css['container']}>
        <div className={css['img-container']}>
          <img src={img_shareCity} alt=""/>
          <span className={css['img-mask']} style={{backgroundImage: `url("${bg_shareCityMask}")`}}/>
        </div>
        <div className={css['main']}>
          <div style={{textAlign: 'center'}}>
            <img className={css['qrcode']} src={img_QR} alt=""/>
            <div style={{display: 'inline-block', verticalAlign: 'top', marginTop: '-.05rem'}}>
              <div className={css['text'] + ' ' + css['text__lg']}>我想去<span className={css['city']}>{this.state.city}</span></div>
              <div className={css['text'] + ' ' + css['text__lg']}>加入我，来场说走就走的旅行</div>
              <div className={css['text'] + ' ' + css['text__sm']}>扫码有惊喜哦</div>
            </div>
          </div>
          {wannaGo}
        </div>
        {
          this.state.showDialog &&
          (
            <div className={css['mask']} onClick={() => { this.setState({showDialog: false}) }}>
              {this.renderDialog()}
            </div>
          )
        }
      </div>
    )
  }

  checkJoined() {
    const userInfo = this.getUserInfo()
    if (!userInfo) {
      this.setState({joined: false})
    } else {
      const onSuccess = (code, msg, data) => {
        requestEnd()
        this.setState({joined: data.isJoin != 0})
      }
      const onFailure = () => {
        requestEnd()
        this.setState({joined: false})
      }
      const params = {id: this.getDesireId()}
      requestStart()
      HttpTool.post(API_CHECK_JOIN_DESIRE, onSuccess, onFailure, params)
    }
  }

  getDesireDetail() {
    const onSuccess = (code, msg, data) => {
      requestEnd()
      this.setState({city: data.city_name})
    }
    const onFailure = (code, msg) => {
      requestEnd()
      Toast.showToast(msg)
    }
    const params = {id: this.getDesireId()}
    requestStart()
    HttpTool.post(API_GET_DESIRE_DETAIL, onSuccess, onFailure, params)
  }

  handleChange(e) {
    const input = e.target
    this.setState({
      [input.name]: input.value,
    })
  }

  handleJoin(e) {
    e.preventDefault()
    if (!this.isValidMobile()) {
      Toast.showToast('请填写正确的手机号码')
      return
    }
    if (!this.isValidCode()) {
      Toast.showToast('请填写正确的验证码')
      return
    }
    this.joinForUnlogined()
  }

  isValidMobile() {
    return /^1\d{10}$/.test(this.state.mobile)
  }

  isValidCode() {
    return /^\d{6}$/.test(this.state.code)
  }

  countDown() {
    const intervalId = setInterval(() => {
      let {count} = this.state
      count--
      this.setState({count})
      if (count <= 0) {
        clearInterval(intervalId)
      }
    }, 1000)
    this.setState({count: 60})
  }

  sendCode() {
    if (!this.isValidMobile()) {
      Toast.showToast('请填写正确的手机号码')
      return
    }
    if (this.state.isSendingCode) {
      Toast.showToast('正在发送，请稍候')
      return
    }
    const onSuccess = (code, msg, json) => {
      Loading.show(false)
      Toast.showToast('已发送验证码，请注意查收')
      this.setState({isSendingCode: false})
      this.countDown()
      this.codeInput.focus()
    }
    const onFailure = (code, msg) => {
      Loading.show(false)
      Toast.showToast(msg)
      this.setState({isSendingCode: false})
    }
    const params = {
      mobile: this.state.mobile,
      codeType: 1,
    }
    this.setState({isSendingCode: true})
    Loading.show(true)
    HttpTool.post(API_ACCOUNT_GET_CODE, onSuccess, onFailure, params)
  }

  getUserInfo() {
    return CookieHelp.getUserInfo()
  }

  getDesireId() {
    // return '9edeacf0-4679-11e7-a61f-07d30aca43d9'
    // return '7a2a3fd0-50a3-11e7-a0b8-75a38c00c3ec'
    return this.helper.app_getParameter(this).id
  }

  joinForLogined() {
    const onSuccess = (code, msg, json) => {
      Loading.show(false)
      this.setState({
        isJoining: false,
        showDialog: true,
        joined: true,
      })
      Toast.showToast('加入成功')
    }
    const onFailure = (code, msg) => {
      Loading.show(false)
      this.setState({isJoining: false})
      Toast.showToast(msg)
    }
    const params = {
      id: this.getDesireId(),
    }
    this.setState({isJoining: true})
    Loading.show(true)
    HttpTool.post(API_JOIN_DESIRE_USER, onSuccess, onFailure, params)
  }

  joinForUnlogined() {
    const onSuccess = (code, msg, json) => {
      Loading.show(false)
      this.setState({
        isJoining: false,
        showDialog: true,
        joined: true,
        isNewUser: !!json.isnew,
      })
      Toast.showToast('加入成功')
      CookieHelp.saveUserInfo(json.user)
    }
    const onFailure = (code, msg) => {
      Loading.show(false)
      this.setState({isJoining: false})
      Toast.showToast(msg)
    }
    const params = {
      id: this.getDesireId(),
      mobile: this.state.mobile,
      verificationCode: this.state.code
    }
    this.setState({isJoining: true})
    Loading.show(true)
    HttpTool.post(API_ADD_DESIRE_REGISTER, onSuccess, onFailure, params)
  }
}

class Dialog extends Component {
  componentDidMount() {
    if (typeof this.props.didLoad === 'function') {
      this.props.didLoad()
    }
  }
  render() {
    return (
      <div className={css['dialog']} onClick={(e) => { e.stopPropagation() }}>
        {this.props.children}
      </div>
    )
  }
}

DesireShare.defaultProps = {
  desire: {}
}

DesireShare.contextTypes = {
  router: React.PropTypes.object
}

module.exports = DesireShare
