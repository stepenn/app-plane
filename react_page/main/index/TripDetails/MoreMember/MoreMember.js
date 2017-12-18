import React, { Component } from 'react';
import HelpI from '../../../../help/Help.js';
import css from './MoreMember.less';
import APISP from '../../../../http/APISP.js';
import  HttpTool from  '../../../../http/HttpTool.js';
import Input from '../../../../component/Dialog/Input/index.js';
import  ImageLoad from '../../../../component/ImageLoad/index';
import ListView from '../../../../component/ListView/ListView.js';
class page extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.state ={
            friendData:[],
        }
    }

    loadData(callparms){
        var param={
            route_id:this.Help.app_getParameter(this).id,
            p:callparms.pageIndex,
            pc:20
        };
        var successCallback = (code, message, json,option)=> {
            if (!json){
                json = [];
            }
            callparms.success(json);
            callparms.finish(true);
        };
        var failCallback = (code, message,option)=> {
            callparms.error(code+message);
            callparms.finish(true);

        };
        HttpTool.post(APISP.api_route_getRouteMembers, successCallback, failCallback,param);
    }
    getItemView(data,position){
        var div =(<MemberList key={"memberList"+position} data={data}/>)
        return div;
    }
    getContent(){
        return (
            <div className={css.main}>
                <ListView className={css.ListView}
                          getListData={this.loadData.bind(this)}
                          getItemView={this.getItemView.bind(this)}
                          action={(clear,loadMore,size,first)=>{
                              if(first){
                                  loadMore();
                              }
                          }}
                />
            </div>
        )
    }
    render(){
        let html = this.getContent();
        var div = (
            <div>{html}</div>
        )
        return this.Help.app_render(this,div,{});
    }

}
class MemberList extends Component{
    constructor(props){
        super(props);
        this.Help = new HelpI();
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
    }
    render(){
        const {data} = this.props;
        return(
            <div className={css.memberList} >
                <div className={css.people} onClick={()=>{
                    this.Help.app_open(this, '/PersonDetail', {
                        title: '个人中心',
                        friendId: data.user_id,
                        friendFrom:3
                    })
                }}>
                    <div className={css.teamImg}>
                        <ImageLoad type={1} bg={true} bgStyle={{
                            borderRadius: "50%",
                        }} src={data.avatar}
                                   error={this.img_defaultAvatar}/>
                    </div>
                    <div className={css.nickName}>
                        <p>{data.nick_name}</p>
                    </div>
                </div>
                {
                    !data.is_friend?
                        <div className={css.addFriend} onClick={()=>{
                            Input.open((v)=>{
                                this.getAddFriend(v,data.user_id)
                            },{max:20});
                        }}>
                            +添加
                        </div>:''
                }
            </div>


        )
    }
    getAddFriend(msg,id){
        var successCallback = (code, message, json, option) => {
            this.setState(
                {
                    friendData:json,

                }
            );
        };
        var failCallback = (code, message) => {
            this.setState(
                {
                    friendData:[],
                }
            );
        };
        HttpTool.post(APISP.api_im_addFriend, successCallback, failCallback, {
            friendFrom:3,
            friendId:id,
            msg:msg
        });

    }
}
MemberList.contextTypes = {
    router:React.PropTypes.object
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
