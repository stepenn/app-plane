/**
 * Created by lixifeng on 17/5/29.
 */

import React, {Component} from 'react';
import  HttpTool from  '../http/HttpTool.js';
import  APILXF from  '../http/APILXF';

class page extends Component {
    ipLocation(successBack, errorBack, p) {
        HttpTool.post(APILXF.api_common_gitCityName, (code, message, json, option) => {
            alert(1);
            successBack(json);
        }, (code, message) => {
            alert(2)
            errorBack({code: code, message: message})
        }, p)
    }

    render() {
        return <div onClick={() => {

            this.ipLocation((p) => {
                alert(33);
            }, (e) => {
                alert(55)
            })

        }}>test</div>
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;