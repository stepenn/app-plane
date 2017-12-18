/**
 * Created by apin on 2017/5/24.
 */
import React, {Component} from 'react';
import css from './ItemTripNone.less';

class index extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={css.full}>
                系统将为你匹配航线
            </div>
        );
    }
}
module.exports = index;