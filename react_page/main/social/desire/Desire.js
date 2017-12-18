/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import DesireBox from './DesireBox'
import ListView from '../../../component/ListView/ListView.js';
import Label from './Label'
import css from './Desire.less';
import HelpI from '../../../help/Help.js';
import HttpTool from '../../../http/HttpTool'
import {API_GET_DESIRE_LIST} from '../../../http/APIYHJ'


class Desire extends Component {
  constructor(props) {
    super(props);
    this.Help = new HelpI();
    this.Help.setPageAnimOption(null);
    this.img_contact = '/serverImg/img_contactsBG.png';
    this.img_bgAdd = '/serverImg/bg_add.png';
    this.img_addId = window.imgHost + '/images/img_addId.png';
  }
    callback(select) {
        //被选择
        if(select){
            if(this.loadMore&&this.listSize<1){
                if(this.listViewObj){
                    this.listViewObj.addFirst({type:"head"},()=>{
                        this.loadMore();
                    })
                }

            }
        }
    }
  componentDidMount() {
      if (this.props.selectCall) {
          this.props.selectCall(this.callback.bind(this));
      }
  }

  onClickDesire(desire) {
    this.Help.app_open(this, '/DesireDetail', {
      title: "愿望池",
      callBack: () => {
        // this.listViewObj.remove(desire.id)
      },
      desire
    })
  }

  getItemView(data, position){
    if(data&&data.type == "head"){
      return this.getHeadView(position);
    }
    return (
      <div key={position} className={css['desire-item']}>
        <DesireBox height="140"
                   onClick={()=>{
                     this.onClickDesire(data);
                   }}
        >
          <img src={this.img_contact} alt={data.city_name} className={css['img']}/>
          <div className={css['desire-content']} style={{fontSize: 20, lineHeight: '140px'}}>{data.city_name}</div>
        </DesireBox>
      </div>
    );
  }
  loadData(callparms) {

    var param={
      p:callparms.pageIndex,
      pc:this.props.pageSize,
    };
    var successCallback = (code, message, json,option)=> {

      callparms.success(json);
      if(option.option.isfinal==1){
        callparms.finish(true);
      }
    };
    var failCallback = (code, message,option)=> {
      callparms.error(code+message);
        if(option.option.isfinal==1){
            callparms.finish(true);
        }
    };


    HttpTool.post( API_GET_DESIRE_LIST, successCallback, failCallback,param);
  }


  getHeadView(position){
    return (
      <div key={position}>
        <div
          className={css['add-box']}
          onClick={() => {
            this.Help.app_open(this, "/AddDesire", {title: "愿望池",
              callBack:(obj)=>{

                if(this.clear){
                  this.clear(()=>{
                    this.listViewObj.addFirst({type:"head"},()=>{
                      this.loadMore();
                    })
                  });
                } }});


          }}
        >
          <div className={css['add-box_bg']} style={{
            backgroundImage: this.Help.getImgUrl(this.img_bgAdd)
          }}/>
          <div className={css['add-box_mask']}>
            <span className={css['add-box_icon']} style={{
              backgroundImage: this.Help.getImgUrl(this.img_addId)
            }}/>
            <span className={css['add-box_text']}>发布愿望</span>
          </div>
        </div>
        <div style={{padding: '.6rem .3rem 0'}}>
          <Label style={{
            fontSize: '.35rem',
            padding: '.4rem .5rem',
          }}>我的愿望池</Label>
        </div>

      </div>
    );
  }
  render() {
    var div = (
      <div
        className={css.main}
      >


        <ListView
          getListData={this.loadData.bind(this)}
          getItemView={this.getItemView.bind(this)}
          action={(clear, loadMore, size, first) => {
            this.listSize = size;
            if (first) {
              this.loadMore = loadMore;
              this.clear = clear;

             // loadMore();
            }
          }}

          getObject={(obj)=>{
            this.listViewObj = obj;

          }}
        />

      </div>

    );
    return div;
  }
}

Desire.defaultProps = {
  pageSize: 3
}

Desire.contextTypes = {
  router: React.PropTypes.object
}
module.exports = Desire;