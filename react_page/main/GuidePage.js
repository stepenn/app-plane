import React, {Component} from 'react'
import css from './GuidePage.less'
import Swiper from 'swiper'

function isLowAspectRatio() {
  return window.innerHeight / window.innerWidth < 1.6
}

class GuidePage extends Component {
  constructor(props) {
    super(props)
    this.go = this.go.bind(this)
    this.initContents()
  }

  componentDidMount() {
    new Swiper(this.container, {
      wrapperClass: css['content'],
      slideClass: css['content_page'],
      onSlideChangeStart: this.updateFooter.bind(this),
    })
    this.goTry.addEventListener('touchstart', this.go)
  }

  render() {
    let className = css['guide-page']
    if (isLowAspectRatio()) {
      className += ' ' + css['guide-page__short']
    }
    return (
      <div
        ref={(guidePage) => { this.guidePage = guidePage }}
        className={className}
      >
        <div
          className={css['container']}
          ref={(container) => { this.container = container }}
        >
          {
            this.renderContent()
          }
          {
            this.renderFooter()
          }
        </div>
      </div>
    )
  }

  renderContent() {
    const pages = []
    const pageWidth = this.getPageWidth()
    const total = this.contents.length
    const contentWidth = pageWidth * total
    for (let i = 0; i < total; i++) {
      const content = this.contents[i]
      const page = (
        <div
          key={i}
          className={css['content_page']}
          style={{
            width: pageWidth,
          }}
        >
          <div className={css['content_header']}>
            <div className={css['content_header-img-container']}>
              <img src={content.headerImg} alt=""/>
              <span className={css['content_img-text']}>{content.imgText}</span>
            </div>
            <span className={css['content_title']} style={{color: content.titleColor}}>{content.title}</span>
          </div>
          <div className={css['content_main']}>
            <img src={content.mainImg} alt=""/>
          </div>
        </div>
      )
      pages.push(page)
    }
    let className = css['content']
    if (this.isMoving) {
      className += ' ' + css['content__disable-transition']
    }

    return (
      <div
        ref={(content) => { this.content = content }}
        className={className}
        style={{width: contentWidth}}
      >{pages}</div>
    )
  }

  renderFooter() {
    const total = this.contents.length
    const indicatorArr = []
    for (let i = 0; i < total; i++) {
      let className = css['indicators_indicator']
      if (i === 0) {
        className += ' ' + css['indicators_indicator__current']
      }
      const indicator = <span key={i} className={className}/>
      indicatorArr.push(indicator)
    }
    const indicators = (
      <div ref={(e) => { this.indicators = e }} className={css['indicators']}>
        {indicatorArr}
      </div>
    )
    const goTry = (
      <div
        ref={(e) => { this.goTry = e }}
        className={css['go-try']}
        style={{display: 'none'}}
      >立即体验</div>
    )
    return (
      <div className={css['footer']}>
        {indicators}
        {goTry}
      </div>
    )
  }

  updateFooter(slider) {
    const total = this.contents.length
    const activeIndex = slider.activeIndex
    if (activeIndex < total - 1) {
      this.indicators.getElementsByClassName(css['indicators_indicator__current'])[0].className =
        css['indicators_indicator']
      this.indicators.getElementsByClassName(css['indicators_indicator'])[activeIndex].className =
        css['indicators_indicator'] + ' ' + css['indicators_indicator__current']
      this.indicators.style.display = ''
      this.goTry.style.display = 'none'
    } else {
      this.indicators.style.display = 'none'
      this.goTry.style.display = ''
    }
  }

  getPageWidth() {
    if (!this.pageWidth) {
      this.pageWidth = window.innerWidth
    }
    return this.pageWidth
  }

  initContents() {
    this.contents = [
      {
        imgText: '团拼包机',
        title: '呼朋唤友 任性去包机',
        titleColor: '#3786d6',
      },
      {
        imgText: '明星网红',
        title: '明星大咖 同行走天涯',
        titleColor: '#e04998',
      },
      {
        imgText: '人脉社区',
        title: '爱谁和谁 只要你敢邀',
        titleColor: '#e96356',
      },
      {
        imgText: '机票分期',
        title: '想飞就飞 分期无压力',
        titleColor: '#33b182',
      },
    ]
    for (let i = 0; i < this.contents.length; i++) {
      const content = this.contents[i]
      content.headerImg = window.imgHost + `/images/guide-header${i + 1}.png`
      content.mainImg = window.imgHost + `/images/guide${i + 1}.png`
    }
  }

  go() {
    this.props.go()
  }

}

GuidePage.contextTypes = {
  router: React.PropTypes.object
}

module.exports = GuidePage