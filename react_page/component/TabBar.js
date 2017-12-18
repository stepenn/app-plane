/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppCss from './TabBar.css';

class TabItem extends  Component{

    render(){
        let {
            title,
            icon,
            iconOff,
            select
        } = this.props;
        // var {...props} = this.props;
        return(
            <div
                {...this.props}
                className={AppCss.navItem}>
                <div className={AppCss.imgDiv}>
                    <img className={AppCss.img} src={select?icon:iconOff}/></div>
                <div className={select?AppCss.fontActivity:AppCss.font}>{title}</div>
            </div>
        );
    }
}

class TabBar extends  Component{

    //构造器(如果你想做某些事情 ..就是我们经常看到的do someing)
    constructor(props){
        super(props);
        this.state = {
            currentIndex:0,
        }
    }

    // getInitialState(){
    //     return {currentIndex: 0}
    // }

    render(){
        return (
        <div className={AppCss.maxContext}>

            <div className={AppCss.content}>
                {
                    React.Children.map(this.props.children, (element, index) => {
                        var select = index==this.state.currentIndex;
                        return (
                            <div
                                className={select?AppCss.mainContextActivity:AppCss.mainContextNone}
                            >
                                {element}
                            </div>);
                    }
                )}
            </div>
            <div className={AppCss.bar}>
                <article className={AppCss.nav}>
                    {
                        React.Children.map(this.props.children, (element, index) => {
                            return (
                                <TabItem
                                    {...element.props}
                                    onClick={()=>{

                                        this.setState({
                                            currentIndex:index,
                                        });
                                        {/*alert(this.state.currentIndex);*/}
                                    }}
                                    select={index==this.state.currentIndex}/>);
                        })
                    }

                </article>

            </div>

        </div>


        )
    }
}

module.exports = TabBar;