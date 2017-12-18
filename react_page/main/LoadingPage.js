import React, {Component} from 'react'
import css from './LoadingPage.less'

class LoadingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
    }
    this.bgEarth = '/serverImg/loading/earth.png'
    this.bgPlane = '/serverImg/loading/plane.png'
    this.bgPlaneLeaf = '/serverImg/loading/plane-leaf.png'
    this.bgCloud = '/serverImg/loading/cloud.png'
  }

  render() {
    const clouds = []
    for (let i = 0; i < 10; i++) {
      if (i < 5) {
        clouds.push((
          <div key={i} className={css['cloud-container']}>
            <span className={css['cloud'] + ' ' + css['cloud' + (i % 5 + 1)]} style={{backgroundImage: `url(${this.bgCloud})`}}/>
          </div>
        ))
      } else {
        clouds.push((
          <div key={i} className={css['cloud-container'] + ' ' + css['cloud-container__left']}>
            <span className={css['cloud'] + ' ' + css['cloud' + (i % 5 + 1)]} style={{backgroundImage: `url(${this.bgCloud})`}}/>
          </div>
        ))
      }
    }
    return (
      <div className={css['loading-page']}>
        <div className={css['progress']}>
          <span className={css['progress_text']}>{Math.floor(this.state.progress * 100)}%Loaded</span>
          <div className={css['progress_outer-bar']}>
            <span className={css['progress_inner-bar']}/>
          </div>
        </div>
        <div className={css['flying-area']}>
          <div className={css['plane']} style={{backgroundImage: `url(${this.bgPlane})`}}>
            <span className={css['plane_leaf']} style={{backgroundImage: `url(${this.bgPlaneLeaf})`}}/>
          </div>
          <div className={css['clouds']}>
            {clouds}
          </div>
        </div>
        <span className={css['earth']} style={{backgroundImage: `url(${this.bgEarth})`}}/>
      </div>
    )
  }
}

module.exports = LoadingPage