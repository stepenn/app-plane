/**
 * Created by apin on 2017/6/5.
 */
import React, {Component} from 'react';
import css from './ItemTripShowPerson.less';

class ItemTripShowPerson extends Component {
    constructor(props){
        super(props);
    }
    render() {
        var {dataItem,index} = this.props;
        var itemView = (<div {...this.props} className={css.cellArea}>
            <div className={css.left}>{index+1}</div>
            <div className={css.right}>
                <div className={css.name}>姓名</div>
                <div className={css.idCard}>{dataItem.passenger_name}</div>
                <div className={dataItem.num?css.num:css.hidden}>{dataItem.num?("票号"+" "+dataItem.num):""}</div>
            </div>
            <div className={css.right}>
                <div className={css.name}>证件</div>
                <div className={css.idCard}>{this.myIdCardType(dataItem.id_type)}</div>
                <div className={css.num}>{dataItem.id_no}</div>
            </div>

            {this.createOtherInfo(dataItem)}
        </div>);
        return itemView;
    }

    createOtherInfo(dataItem){
        var otherDiv =null;
        let type = parseInt(dataItem.id_type);

        var sex = dataItem.gender?(dataItem.gender=="1"?"男":"女"):"女";
        otherDiv = (<div>
            <div className={dataItem.type?css.right:css.hidden}>
                <div className={css.name}>类别</div>
                <div className={css.idCard}>{dataItem.type?(dataItem.type==1?"成人":"儿童"):""}</div>
                <div className={css.num}>{sex}</div>
            </div>
            <div className={dataItem.nation?css.right:css.hidden}>
                <div className={css.name}>国籍</div>
                <div className={css.num}>{dataItem.nation?dataItem.nation:""}</div>
            </div>
            <div className={dataItem.birthday?css.right:css.hidden}>
                <div className={css.name}>生日</div>
                <div className={css.num}>{dataItem.birthday?dataItem.birthday:""}</div>
            </div>
            <div className={dataItem.issue_place?css.right:css.hidden}>
                <div className={css.refName}>证件签发地</div>
                <div className={css.refNum}>{dataItem.issue_place?dataItem.issue_place:""}</div>
            </div>
            <div className={dataItem.expire_time?css.right:css.hidden}>
                <div className={css.refName}>证件有效期</div>
                <div className={css.refNum}>{dataItem.expire_time?dataItem.expire_time:""}</div>
            </div>
        </div>);
        return otherDiv;
        // switch (type){
        //     case 1 : {
        //         //身份证
        //         otherDiv = null;
        //     }
        //         break;
        //     case 2 : {
        //         var sex = dataItem.gender?(dataItem.gender=="1"?"男":"女"):"女";
        //         otherDiv = (<div>
        //             <div className={dataItem.type?css.right:css.hidden}>
        //                 <div className={css.name}>类别</div>
        //                 <div className={css.idCard}>{dataItem.type?(dataItem.type==1?"成人":"儿童"):""}</div>
        //                 <div className={css.num}>{sex}</div>
        //             </div>
        //             <div className={dataItem.country?css.right:css.hidden}>
        //                 <div className={css.name}>国籍</div>
        //                 <div className={css.num}>{dataItem.nation?dataItem.nation:""}</div>
        //             </div>
        //             <div className={dataItem.birthday?css.right:css.hidden}>
        //                 <div className={css.name}>生日</div>
        //                 <div className={css.num}>{dataItem.birthday?dataItem.birthday:""}</div>
        //             </div>
        //             <div className={dataItem.issue_place?css.right:css.hidden}>
        //                 <div className={css.refName}>证件签发地</div>
        //                 <div className={css.refNum}>{dataItem.issue_place?dataItem.issue_place:""}</div>
        //             </div>
        //             <div className={dataItem.expire_time?css.right:css.hidden}>
        //                 <div className={css.refName}>证件有效期</div>
        //                 <div className={css.refNum}>{dataItem.expire_time?dataItem.expire_time:""}</div>
        //             </div>
        //         </div>);
        //     }
        //         break;
        //     case 3 : {
        //         //军人证
        //         otherDiv = null;
        //     }
        //         break;
        //     case 4 : {
        //         //港澳通行证
        //         otherDiv = null;
        //     }
        //         break;
        //     default : {
        //         otherDiv = null;
        //     }
        //         break;
        // }
        // return otherDiv;
    }
    myIdCardType(idType){
        var myType = "";
        var type = parseInt(idType);
        switch (type){
            case 1 : {
                myType = "身份证";
            }
                break;
            case 2 : {
                myType = "护照";
            }
                break;
            case 3 : {
                myType = "军人证";
            }
                break;
            case 4 : {
                myType = "港澳通行证";
            }
                break;
            default : {
                myType = "";
            }
                break;
        }
        return myType;
    }
}
module.exports = ItemTripShowPerson;