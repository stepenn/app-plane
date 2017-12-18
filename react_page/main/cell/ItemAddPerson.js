/**
 * Created by apin on 2017/6/6.
 */
import React, {Component} from 'react';
import css from './ItemAddPerson.less';
import SelectAlert from '../../component/Dialog/Select/index.js'

class ItemAddPerson extends Component {
    constructor(props){
        super(props);
        this.Help = this.props.Help;
        this.perDataArr = [];
        if(this.props.obj){
            this.props.obj({getSelectData:this.getSelectData.bind(this)})
        }
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
        this.img_deleteIcon = window.imgHost + '/images/delete_icon.png';
        this.state = {
            upDataItem:0,
        };
    }

    getSelectData(){
        var adult_count = 0;
        var child_count = 0;
        var id = [];
        if (this.perDataArr.length>0){
            for (let i=0;i<this.perDataArr.length;i++){
                var item = this.perDataArr[i];
                if (item.type == 1){
                    adult_count = adult_count+1;
                }else {
                    child_count = child_count+1;
                }
                id.push(item.id);
            }
        }
        return {adult_count:adult_count,child_count:child_count,id:JSON.stringify(id)};
    }

    upView(){
        this.setState({
            upDataItem:this.state.upDataItem+1,
        })
    }
    render() {
        // var {dataItem,open} = this.props;
        var itemView = (<div {...this.props} className={css.cellArea}>
            {this.createAddPer()}
            <div className={css.refCell} onClick={()=>{
                this.Help.app_open(this, "/MyPlane",{
                    title:"添加乘机人",
                    isSelectPer:true,
                    selectArr:this.perDataArr,
                    callBack:(myItem)=>{
                        if (!this.perDataArr||this.perDataArr.length<1){
                            this.perDataArr.push(myItem);
                            this.upView();
                        }else {
                            var isRepeat = false;
                            for (let i=0;i<this.perDataArr.length;i++){
                                var item = this.perDataArr[i];
                                if (item.id_no==myItem.id_no){
                                    isRepeat = true;
                                    break;
                                }
                            }
                            if (!isRepeat){
                                this.perDataArr.push(myItem);
                                this.upView();
                            }
                        }
                    }}
                )
            }}>
                <div className={css.leftCell}>
                    <div className={css.title}>添加乘机人</div>
                </div>
                <div className={css.rightCell}>
                    <img className={css.imgCell} src={this.img_rightArrow}/>
                </div>
            </div>

        </div>);
        return itemView;
    }

    createAddPer(){
        if (!this.perDataArr||this.perDataArr.length<1){
            return (<div></div>);
        }
        var divArr = [];
        for (let i = 0;i<this.perDataArr.length;i++){
            let item = this.perDataArr[i];
            var div = (<div key={i} className={css.cell}>
                <div className={css.leftCell}>
                    <div className={item.type?css.title:css.hidden}>{"乘机人信息("+(item.type==1?"成人":"儿童") +")"}</div>
                    <div className={item.passenger_name?css.title:css.hidden}>{item.passenger_name?item.passenger_name:""}</div>
                    <div className={item.id_type?css.refTitle:css.hidden}>{item.id_type?this.myIdCardType(item.id_type):""}</div>
                    <div className={item.id_no?css.con:css.hidden}>{item.id_no?item.id_no:""}</div>
                </div>
                <div className={css.rightCell}>
                    <img className={css.imgCell} src={this.img_deleteIcon} onClick={()=>{
                        SelectAlert.open((yes)=>{
                            this.selectYes = yes;
                        },{
                            title:"温馨提示",
                            content:"删除乘机人,小主再考虑一下吧",
                            quit:"取消",
                            sure:"确定",
                            isShow:true,
                        },()=>{
                            //关闭之后
                            if (this.selectYes) {
                                this.remove(i,this.perDataArr);
                                this.getSelectData();
                                this.upView();
                            }
                            this.selectYes = undefined;
                        });
                    }}/>
                </div>
            </div>)
            divArr.push(div);
        }
        return divArr;
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
    remove(dx, arr) {
        if (isNaN(dx) || dx > arr.length) {
            return false;
        }
        for (var i = 0, n = 0; i < arr.length; i++) {
            if (arr[i] != arr[dx]) {
                arr[n++] = arr[i]
            }
        }
        arr.length -= 1
    }
}


ItemAddPerson.contextTypes = {
    router: React.PropTypes.object
}
module.exports = ItemAddPerson;