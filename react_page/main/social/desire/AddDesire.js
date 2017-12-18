/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import  ScrollView from  '../../../component/ScrollDiv/ScrollDivCom.js';
import Button from './Button'
import HelpI from '../../../help/Help.js';
import Toast from '../../../component/Toast'
import css from './AddDesire.less'
import HttpTool from '../../../http/HttpTool'
import {API_ADD_DESIRE, API_GET_CITY_LIST} from '../../../http/APIYHJ'
import debounce from './debounce'
import ApinSelect from '../../../component/Dialog/ApinSelect'
import Share from '../../../component/Dialog/Share'
import getDesireShareOption from './getDesireShareOption'

class AddDesire extends Component {
  constructor(props) {
    super(props);
    this.Help = new HelpI();
    this.state = {
      cityName: '',
      submittedCityName: '',
      canSubmit: false,
      keyword: '',
      suggestions: [],
      showSuggestions: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.hideSuggestions = this.hideSuggestions.bind(this)
    this.debouncedFetch = debounce(this.fetchSuggestions.bind(this), 500)
    this.img_balloon = window.imgHost + '/images/balloon.png';
  }

  fetchSuggestions(keyword) {
    if (keyword === this.state.keyword || !keyword.trim()) return
    const onSuccess = (code, msg, json) => {
      this.setState({
        keyword: keyword,
        suggestions: json,
      })
    }
    const onFailure = (code, msg) => {

    }
    const params = {keyword}
    HttpTool.post(API_GET_CITY_LIST, onSuccess, onFailure, params)
  }

  shouldShowSuggestions() {
    return this.state.showSuggestions && this.state.keyword === this.state.cityName
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({
      cityName: value,
      canSubmit: !!value,
    })
    this.debouncedFetch(value)
  }

  check(value) {
    return /^[\u2E80-\u9FFFa-zA-Z]+$/.test(value)
  }

  componentWillUnmount(){
    if (this.added) {
      this.Help.setIntent(true);
    }
    this.Help.close(this);
  }

  handleSubmit(e) {
    e.preventDefault()
    const {cityName} = this.state
    if (!this.check(cityName)) {
      Toast.showToast('城市名称只允许汉字和英文字母')
      return
    }
    const submittedCityName = cityName
    const onSuccess = (code, msg, json) => {
      this.added = true
      this.setState({
        submittedCityName,
      }, () => {
        ApinSelect.open((yes) => {
          this.selectYes = yes;
        }, {
          content: '愿望发布成功，邀请更多好友加入吧',
          confirm: '暂不邀请',
          cancel: '邀请好友'
        }, () => {
          if (this.selectYes) {
            Share.open((state, info) => {
              if (state) {
                Toast.showToast("分享成功");
              } else {
              }
            }, getDesireShareOption({
              city_name: submittedCityName,
              shareurl: json.shareurl,
            }), () => {
              this.Help.back(this)
            })
          } else {
            this.Help.back(this)
          }

        });

      })
    }
    const onFailure = (code, msg) => {
      Toast.showToast(msg)
    }
    const params = {city_name: submittedCityName}
    HttpTool.post(API_ADD_DESIRE, onSuccess, onFailure, params)
  }

  renderSuggestionItem(suggestion) {
    return (
      <div
        key={suggestion.city_name}
        className={css['suggestion-item']}
        onClick={() => {
          this.setState({
            cityName: suggestion.city_name,
            canSubmit: true,
          })
          this.hideSuggestions()
          this.input.focus()
        }}
      >{suggestion.city_name}</div>
    )
  }

  hideSuggestions() {
    this.setState({
      showSuggestions: false,
    })
  }

  render() {

    var div = (
      <div className={css.main} onClick={() => {
        if (this.state.showSuggestions) {
          this.setState({
            showSuggestions: false,
          })
        }
      }}>
        <div className={css['add-desire']}>
          <form onSubmit={this.handleSubmit}>
            <div>
              <div>
                <span className={css['balloon']} style={{
                  backgroundImage: this.Help.getImgUrl(this.img_balloon)
                }}/>
                <span className={css['wanna-go']}>我想去</span>
                <div className={css['input-wrapper']}>
                  <input
                    ref={(input) => { this.input = input }}
                    type="text"
                    autoFocus
                    value={this.state.cityName}
                    onChange={this.handleChange}
                    onFocus={() => { this.setState({showSuggestions: true,})} }
                    onClick={(e) =>{ e.stopPropagation() }}
                  />
                  <div className={css['suggestion-list']}
                       style={{display: this.shouldShowSuggestions() ? 'block' : 'none'}}>
                    <ScrollView

                    >
                      {
                        this.state.suggestions.map(this.renderSuggestionItem.bind(this))
                      }
                    </ScrollView>
                  </div>
                </div>

              </div>
              <div style={{
                marginTop: '40px'
              }}>
                <Button disabled={!this.state.canSubmit} exotic size="lg">确定</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
    return this.Help.app_render(this, div);
  }
}
AddDesire.contextTypes = {
  router: React.PropTypes.object
}
module.exports = AddDesire;