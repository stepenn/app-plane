/**
 * Created by tzsw on 16/12/6.
 */
import React from 'react';
import SelectDate from './SelectDate';
import  DialogTool from '../DialogTool.js';
module.exports = {
    open(onSelect, time, dateFormat,option){


        let id = "MYETCVIEW_SelectDate";
        if (!dateFormat) {
            dateFormat = ['YYYY年', 'MM月', 'DD日', 'hh点'];
        }

        var t = <SelectDate
            dateFormat={dateFormat}
            {...option}
            value={time}
            isOpen={true}
            onSelect={(date, str) => {
                if (onSelect) {
                    onSelect(date, str);
                }
                DialogTool.back();

            }}
            onCancel={() => {
                DialogTool.back();
            }}

        />;
        DialogTool.render(id, t);


    }

};
