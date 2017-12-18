import React, { Component } from 'react';
import HelpI from '../../../help/Help.js';
import Toast from '../../../component/Toast/index.js';
import ScrollView from '../../../component/ScrollDiv/ScrollDivCom.js';
import ChooseData from '../../public/ChooseData/index';
import ClickHelp from '../../../tool/ClickHelp.js';
import Button from '../../public/Button/index';
import css from './FriendSelect.less';
import Swiper from 'swiper'
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.count = 0;
        this.state = {
            show:false,
        }
        this.postValue = this.Help.app_getParameter(this).postValue;
        if(!this.postValue){this.postValue={}}
        this.img_battleTitle = window.imgHost + '/images/battle_title.png';
        this.img_inputPW = window.imgHost + '/images/input_PW.png';
        this.img_downArrow = window.imgHost + '/images/img_downArrow.png';
        this.img_board = window.imgHost + '/images/bg_board.png';
    }
    loadDaysData(){
        this.useData1 =[];
        this.useData2 =[];
        for(let i = 0;i<100;i++){
            this.useData1.push((i+1)+"位成人");
            this.useData2.push((i)+"位儿童");
        }

        this.setState({show:true});
    }
    animEnter(){
        this.loadDaysData();
    }
    componentWillUnmount(){
        this.Help.close(this);
    }
    render(){
        var main   =   <div className={css.css_layout_none}>调用亲友中 请稍候...</div>;
        if(this.state.show){
            main = (
                <div>
                    <div className={css.chooseBattle} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_battleTitle)
                    }}>选择亲友的人数</div>
                    <div className={css.arrowMonth} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_downArrow)
                    }}/>
                    <div className={css.month} style={{
                        backgroundImage: this.Help.getImgUrl(this.img_board)
                    }}>
                        <ChooseData
                            data={this.useData1}
                            initialSlide={this.postValue.adult_count?this.postValue.adult_count-1:0}
                            select={(state)=>{
                                this.select_1 = state;
                            }}
                        />
                        <ChooseData
                            data={this.useData2}
                            initialSlide={this.postValue.child_count?this.postValue.child_count:0}
                            select={(state)=>{
                                this.select_2 = state;
                            }}
                        />

                    </div>
                    <br/>
                    <div>请左右滑动,选择出行人数</div>
                    <br/>
                    <Button  onClick={(e)=>{
                        var postValue = {};
                        postValue.adult_count = this.select_1.replace("位成人","");
                        postValue.child_count = this.select_2.replace("位儿童","");
                        log(postValue);
                        this.Help.setIntent(postValue);
                        this.Help.back(this);
                        ClickHelp.stopClick(e);

                    }}>
                        确认
                    </Button>
                </div>
            )
        }
        var div = (
            <ScrollView className={css.main}>
                {main}
            </ScrollView>
        )
        return this.Help.app_render(this,div);
    }
}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
