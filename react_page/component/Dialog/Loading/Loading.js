/**
 * Created by Administrator on 2016/12/6.
 */
import React, {Component} from 'react';
import css from './Loading.css';
class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var style = {
            width:"100%",
            height:"100%",
        }
        return (
            <div className={css.bg}
                 style={style}
            >
                <div className={css.main}
                >
                    <div className={css.ball_scale_ripple}></div>
                </div>
            </div>

        )
    }
}
module.exports = Loading;