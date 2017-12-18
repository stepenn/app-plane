/**
 * Created by lixifeng on 17/5/29.
 */
import React, {Component} from 'react';
import css from './index.less';
import ImageUp from '../ImageUp/index';
/**
 * maxSize :图片最大数
 * obj.getUrl 返回URL列表对像
 * notice:
 * 时时通知最新状态
 */
class index extends Component {
    constructor(props) {
        super(props);
        this.maxSize = 8;
        if(this.props.maxSize){
            this.maxSize = this.props.maxSize;
        }

        this.url =  [];
        if(this.props.url){
            this.url = this.props.url;
        }


        this.state = {
            upData: 0,
        }
        if(this.props.obj){
            this.props.obj({getUrl:this.getUrl.bind(this)});
        }


    }
    notice(){
        if(this.props.notice){
            this.props.notice(this.url);
        }
    }
    getUrl(){
        return this.url;
    }
    upView(){
        this.notice();
        this.setState({
            upData:this.state.upData+1,
        });
    }

    getShowView(option){
        var upData = this.state.upData;
        var viewS = [];
        let size = this.url.length;
        for(let i=0;i<size;i++){
            viewS.push(
                <div
                    key={upData+"_"+i}
                    className={css.layoutItem}>
                    <ImageUp
                        option={option}
                        src={this.url[i]}
                        clearListen={()=>{
                            this.url.splice(i,1);
                            this.upView();
                        }}
                    />
                </div>
            )
        }
        //后面追加添加
        if(size<this.maxSize){
            viewS.push(
                <div
                    key={upData+"_"+size}
                    className={css.layoutItem}>
                    <ImageUp
                        option={option}
                        successListen={(url)=>{
                            this.url.push(url);
                            this.upView();
                        }

                        }     />
                </div>
            )
        }

        return viewS;

    }
    render() {
        var {option} = this.props;
        return (
            <div className={css.layout}>
                {this.getShowView(option)}
                <div className={css.clear}/>

            </div>
        )

    }
}
module.exports = index;