/**
 * Created by Administrator on 2016/10/28.
 * 页面打开动画 管理器
 */
import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';
import css from './PageAnim.less';
class  PageAnim extends Component{

    constructor(props){
        super(props);
        this.state = {showAnim:true,};
        if(this.props.action){
            this.props.action({
                setShowView:this.setShowView.bind(this),
            });
        }

    }
    getDuration(){
        return 500;
    }

    setShowView(show){
        this.setState({
            showAnim:show,
        });
    }
    render(){

        //执行动画 ，返回动画视图，动画时长？ 阻塞

       var animView =
           <QueueAnim
               {...this.props.option}
               onEnd={(obj)=>{
                   //obj.type enter 进
                   //obj.type leave 出
                   if(this.props.callBack){
                       this.props.callBack(obj.type=="enter");
                   }
               }}
               className={css.contentFull} duration={this.getDuration()}>
               {
                   this.state.showAnim?
                       <div key="key1" className={css.contentFull}>
                           {this.props.children}
                       </div>
                       :
                       null
               }
        </QueueAnim>;
        return animView;
        
    }
}
module.exports = PageAnim;
