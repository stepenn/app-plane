/**
 * Created by Administrator on 2016/10/31.
 */
import React, {Component} from 'react';
import css from './Loading.css';

class Loading extends Component{
    render(){
        var {show}=this.props;

        var cssV=show?css.show:css.hidden;
        return(
            <div className={cssV}>
                <img className={css.loadingImg} src="/images/loadui/loading5.gif"/>
            </div>
        )}
}
module.exports =  Loading;