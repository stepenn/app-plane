/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './ImageSee.css';
import cssLoad from './Loading.css';
import ScrollDivV from '../../ScrollDiv/ScrollDivCom.js';

class ImageSee extends Component {

    constructor(props) {
        super(props);
        this.imgW = 10;
        this.imgH = 10;
        this.state = {
            upData: 0,
        }
    }

    upView() {
        this.setState({
            upData: this.state.upData + 1,
        });
    }

    componentDidMount() {


    }

    upDataImg() {
        var img = this.refs.img;
        if (!img.width) {
            img.width = 0;
        }
        if (!img.height) {
            img.height = 0;
        }
        this.imgW = img.width;
        this.imgH = img.height;
        this.upView();
    }

    render() {

        var load = this.loadFinsh ? null : (
            <div className={cssLoad.main}
            >
                <div className={cssLoad.ball_scale_ripple}></div>
            </div>
        );
        var width = Math.max(this.imgW, window.screen.width);
        var height = Math.max(this.imgH, window.screen.height);
        var pro = {
            style: {width: width, height: height},
        }
        var imgValue = null;
        if(this.error){
            imgValue = "./cry.png";
        }else{
            imgValue = this.props.option.url;
        }
        return (
            <ScrollDivV className={css.bg} pro={pro} x={true} y={true}
                        callBack={(jroll) => {
                            this.jrollContent = jroll;
                        }}
                        onClick={() => {
                            this.close();
                        }}
            >

                <img
                    className={css.main}
                    ref="img"
                    onLoad={() => {
                        this.loadFinsh = true;
                        this.upDataImg();
                    }}
                    onError={() => {
                        this.loadFinsh = true;
                        this.error = true;
                        //错误
                        this.upDataImg();

                    }}
                    src={imgValue}/>
                {load}
            </ScrollDivV>

        )
    }


    close() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
}
module.exports = ImageSee;