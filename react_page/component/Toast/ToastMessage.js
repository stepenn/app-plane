/**
 * Created by Administrator on 2016/10/30.
 */
import React, {Component} from 'react';
import css from './ToastMessage.css';
import QueueAnim from 'rc-queue-anim';

class ToastMessage extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            title:props.title,
            bgcolor:props.bgcolor,
            fontcolor:props.fontcolor,
        }

        if(this.props.updata){
            this.props.updata(this.setTitle.bind(this));
        }
    }
    setTitle(title, bgcolor, fontcolor){

        this.setState(
            {
                show: true,
                title:title,
                bgcolor:bgcolor,
                fontcolor:fontcolor,
            }
        );
        this.startClose();
    }

    startClose(){
        if(this.interval){
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            clearInterval(this.interval);
            this.setState({
                show: false,
            });
        }, 2000);
    }
    componentDidMount() {
      this.startClose();
    }

    render(){
        var cssV=css.showtoast;
       var colo = {
           background:this.state.bgcolor,
           color:this.state.fontcolor,
       };
        return (
        <QueueAnim  type="top" >
            {this.state.show?
                <div key="key"   className={cssV} style={colo}>{this.state.title}</div>
                :null
            }
          
        </QueueAnim>
          
        );
    }
}
module.exports = ToastMessage;