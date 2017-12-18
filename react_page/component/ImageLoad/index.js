/**
 * Created by lixifeng on 17/1/17.
 */
import React, {Component} from 'react';
import css from './index.css';
/**
 * error:错误图片地址
 * src:图片地址
 * bg:图片是否以背影显示(不拉伸)
 * bgStyle 北京的布局
 * type:默认是方的 1 代表圆
 */
class com extends Component{

    constructor(props){
        super(props);
        this.errSrc =props.error;
        // this.defaultScr = require("./img_err.png");
        this.defaultScr = window.imgHost + '/images/img_err.png';
        this.type = props.type?props.type:-1;
        this.state = {
            state:0,
        }
        this.getImage(props);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.src!=this.props.src){
            this.getImage(nextProps);
            this.handleImage(0);
        }
        //更新显示URL
    }
    getImage(props){
        this.src =  props.src;
    }
    handleImage(state) {
        this.setState({ state:state });
    }

    //渲染图片
    render(){
        var loadSrc =  null;

        var state = this.state.state;

        var myFrame = this.type==1?css.circleFrame:css.frame;

        if(!this.src){
            //无图片,直接显示错误
            state = -1;
        }
        if(state==0){
            //加载中
            loadSrc =  (
                <div className={myFrame}>
                <div className={css.loadCenter}>
                    <div className={css.ballBeat}/>
                    <div className={css.ballBeat2}/>
                    <div className={css.ballBeat3}/>
                </div>
            </div>
            )
        }else
        if(state==1){
            //加载成功
            loadSrc =  null;
        }else if(state==2){
            var bgStyle = {};
            if(this.props.bgStyle){
                bgStyle = this.props.bgStyle;
            }
            bgStyle.backgroundImage = "url("+this.src+")";
            //加载成功
            loadSrc =  <div className={css.imgRight}  style={bgStyle}>
            </div>;
        }else{
            //加载错误
            if(this.errSrc){
                this.src = this.errSrc;
            }else{
                loadSrc = (
                    <div className={myFrame}>
                        <img className={css.imgError} src={this.defaultScr} />
                    </div>
                );
            }

        }



        return(
            <div
                {...this.props}
            >
                <img
                    className={state==-1||state==2?css.hidden:myFrame}
                    onLoad={()=>{
                        this.handleImage(this.props.bg?2:1);
                    }}
                    onError={()=>{
                        this.handleImage(-1);
                    }}
                    src={this.src}
                />
                {loadSrc}
            </div>
        );
    }
}
module.exports =  com;