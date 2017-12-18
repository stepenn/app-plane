/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';
import css from './index.less';
import Swiper from 'swiper'
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: this.props.data,
            index: 0,
        }
    }

    setSelect(i) {
        this.setState({
            index: i,
        });
        if (this.props.select&&this.state.datas) {
            this.props.select(this.state.datas[i]);
        }
    }

    initSwiper() {
        this.Swiper = new Swiper(this.refs.secs, {
            effect: 'coverflow',
            wrapperClass: css["content"],
            slideClass: css["content_page"],
            initialSlide:this.props.initialSlide,
            slidesPerView: 3,
            centeredSlides: true,
            observer: true,
            observeParents: true,
            onInit: (swiper) => {
                this.setSelect(swiper.activeIndex);
            },
            onTransitionEnd: (swiper) => {
                this.setSelect(swiper.activeIndex);
            },
            onSlideChangeEnd: (swiper) => {
                this.setSelect(swiper.activeIndex);
            }
        });
    }

    componentDidMount() {
        this.initSwiper();
    }

    render() {
        let html = this.state.datas?this.state.datas.map((item, i) => {
            return <li
                className={css["content_page"]}

                key={i}
                style={{listStyle: 'none', textAlign: 'center'}}
                       onClick={() => {
                           this.Swiper.slideTo(i, 1000, false);//切换到第一个slide，速度为1秒
                           this.setSelect(i);
                       }}
            >

                {
                    item ?
                        (<div className={i == this.state.index ? css.timeActive : css.timeList}
                              style={{overflow: 'hidden'}} key={i}
                        >
                            {item}
                        </div>) :
                        (<div/>)
                }


            </li>
        }):null;
        return (
            <div className={css.secCon} ref="secs">
                <ul  className={css["content"]}>
                    {html}
                </ul>
            </div>
        )
    }
}
module.exports = index;