import React, {Component} from 'react';
import css from './Employees.less';
import HelpI from '../../../help/Help.js';
import ListView from '../../../component/ListView/ListView.js';
import ShareWhere from './ShareWhere.js';
import APISP from '../../../http/APISP.js';
import HttpTool from '../../../http/HttpTool.js';
import ImageLoad from '../../../component/ImageLoad/index.js';
import Toast from '../../../component/Toast/index.js';
import Share from '../../../component/Dialog/Share/index.js';
class page extends  Component{
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.route_id = this.Help.app_getParameter(this).id;
        this.to_city_name = this.Help.app_getParameter(this).to_city_name;
        this.img_rightArrow = window.imgHost + '/images/icon_right.png';
        this.img_huizhang = window.imgHost + '/images/huizhang.png';
    }
    render(){
         var main = (
                <div className={css.main}>
                    <img className={css.logo} src={this.img_huizhang} />
                    <ListView className={css.ListView}
                    getListData={this.loadData.bind(this)}
                    getItemView={this.getItemView.bind(this)}
                    action={(clear,loadMore,size,first)=>{
                        if(first){
                            loadMore();
                        }
                    }}/>
                </div>);
        return this.Help.app_render(this,main,{actionView:this.createRight_Bar()});
    }
    createRight_Bar(){
       var right_bar = <span className={css.inviteLogo}
              style={{
                  backgroundImage: this.Help.getImgUrl(this.img_rightArrow)
              }}
              onClick={()=>{
                  if (!this.shareUrl){
                      Toast.showToast("分享链接不存在")
                  }
                  Share.open((state,info)=>{
                      if(state){
                          Toast.showToast("分享成功");
                      }else{

                      }
                  },{
                      title:"如果你不出去走走，你就会以为这就是世界。",
                      content:"只要半个平米的价格，我们一起拼机去"+this.to_city_name?this.to_city_name:""+"吧。",
                      href: this.shareUrl,
                  },()=>{
                      {/*alert("页面关闭分享");*/}
                  })

              }
              }
        />;
        return right_bar;
    }

    loadData(callparms){
        var param={
            route_id:this.route_id,
            pc: 50,
            p:callparms.pageIndex,
        };
        var successCallback = (code, message, json,option)=> {
            if (!json){
                json = [];
            }
            if (option&&option.option){
                this.shareUrl = option.option.shareUrl
            }
            var result = [];
            for(var i=0,len=json.length;i<len;i+=3){
                result.push(json.slice(i,i+3));
            }
            callparms.success(result);
            callparms.finish(true);
            // if(option.option.isfinal==1){
            //     callparms.finish(true);
            // }
        };
        var failCallback = (code, message,option)=> {
            callparms.error(code+message);
            callparms.finish(true);
            // if(option.option.isfinal==1){
            //     callparms.finish(true);
            // }
        };
        HttpTool.post(APISP.api_route_getRouteMembers, successCallback, failCallback,param);
    }
    getItemView(data,position){
        var div =(<OneEmployees key={"employees"+position} data={data}/>)
        return div;
    }
}

class OneEmployees extends Component{
    constructor(props) {
        super(props);
        this.Help = new HelpI();
        this.img_headRing = window.imgHost + '/images/bg_head_ring.png';
        this.img_defaultAvatar = window.imgHost + '/images/icon_logo.png';
    }

    render(){
        const {data} =this.props;
        if(!data.length) return null;
        var viewS = [];

        for(let i in data){
            let obj = data[i]
            viewS.push(
                <div key={"img" + i} className={css['memberImg' + i]} onClick={()=>{
                    this.Help.app_open(this, '/PersonDetail', {
                        title: '个人中心',
                        friendId: obj.user_id,
                        friendFrom:3,
                    })
                }}>
                    <div className={css.imgCon}>
                        <ImageLoad
                            bg={true}
                            bgStyle={{borderRadius: "50%"}}
                            src={obj.avatar}
                            error={this.img_defaultAvatar}/>
                    </div>

                    <div className={css.bg} style={{
                        backgroundImage:this.Help.getImgUrl(this.img_headRing)
                    }}></div>

                </div>
            )
        }
        return(
            <div className={css.MemberList}>
                {viewS}
            </div>
        )
    }
}
OneEmployees.contextTypes = {
    router: React.PropTypes.object
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;
