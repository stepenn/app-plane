/**
 * Created by lixifeng on 16/11/2.
 */
// var JRoll = require('./jroll.js');
var JRoll = require('jroll');
import React, {Component} from 'react';
import css from './ListView.css';

class ListView extends Component{
    constructor(props) {

        super(props);
        this.pageIndex = 1;
        this.endData = false;//是否结束加载
        this.loadMoreMsgDefaut = "小拼正在飞速加载中...";
        this.loadMoreMsgIng = "加载中";
        this.loadMoreMsgTouch = "松手加载";
        this.loadMoreMsgIngTouch = "加载中,请松手";
        this.loadMoreMsgFinsh = "加载完成";
        this.loadMoreMsgFinshData = "没有更多数据了";
        this.loadLock = false;//加载数据中,不能再次加载

        this.state = {
            allData:[],//所有数据的数据源
            loadMoreMsg:this.loadMoreMsgDefaut,//加载更多提示语
        }
        var v = ("time_"+new Date().getTime()+this.randomString(6));
        this.idv = this.props.idv ? this.props.idv + v : v;
        this.img_defaultView = window.imgHost + '/images/img_defaultView.png';
    }
    randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    loadMoreData1(parms){
        //请求数据
        this.props.getListData(parms);
    }

    componentDidUpdate(prevProps, prevState){
        this.start();
    }

    start(){
        // var allCount = this.state.allData.length;
        //
        // if(this.props.start&&allCount<1){
        //     this.exeLoad();
        // }
    }

    clear(callBack){
        this.setState({
            allData:[],
        });
        this.pageIndex = 1;
        setTimeout(()=>{

            //更新高度
            this.jroll.refresh();
          this.jroll.scrollTo(0, 0, 200,false,callBack);
            //解锁
            this.loadLock = false;
            this.endData = false;
            //恢复默认
            this.setShowLoadMsg(this.loadMoreMsgDefaut);

            this.callbackAction(false);
        },200)

    }
    loadMore(){
        if(this.loadLock){return};
        setTimeout(()=>{
            this.exeLoad(false);
        },200)
    }

    callbackAction(first){
        var {action} = this.props;

        if(action){
            action((callBack)=>{
                this.clear(callBack);
            },()=>{
                this.loadMore();
            },this.state.allData.length,first);
        }
    }

    addDataToArr(data){
        var dataView =[];
        // var allCount = this.state.allData.length
        var count = data.length;

        if(!this.position){
            this.position =0;
        }
        for(var i=0;i<count;i++){
            dataView.push(this.props.getItemView(data[i],this.position))
            this.position++;
        }
        return dataView;
    }

    upDataList(allData,callBack){
        this.setState({
            allData: allData,
        });
        log(allData);
        setTimeout(()=>{
            //更新高度
            this.jroll.refresh();
            //解锁
            this.loadLock = false;
            //恢复默认
            this.setShowLoadMsg(this.loadMoreMsgDefaut);
            this.callbackAction(false);
            if(callBack){
                setTimeout(()=>{
                    callBack(this);
                },200)
            }

        },200);
    }

    removeData(position,callBack){
        //删除指定的，视图源对像1234567891
        //index 原始索引中搜索索引
        var size =  this.state.allData.length;
        for(var i=0;i<size;i++){
            var view = this.state.allData[i];
            if(view.key==position){
                //remove
                this.remove(this.state.allData,i);
                break;
            }
            //1
        }
        this.upDataList(this.state.allData,callBack);
    }

    /**
     * 更新数据源
     * @param position 视图KEY,
     * @param callBack 更新视图完成
     */
    updateData(position,data,callBack){
        var size =  this.state.allData.length;
        for(var i=0;i<size;i++){
            var view = this.state.allData[i];
            if(view.key==position){
                //更新
                this.state.allData[i] = this.props.getItemView(data,position);
                break;
            }
            //1
        }
        this.upDataList(this.state.allData,callBack);
    }


    /**
     * 添加数据源，不影响分页
     * @param data [] 数组
     */
    addLast(data,callBack){
        //添加数据,到最后一位,ID不重新计算
        data = this.getArrData(data);
        this.upDataList( this.state.allData.concat(this.addDataToArr(data)),callBack);
    }
    addFirst(data,callBack){
        //添加数据,到首位,ID不重新计算
        data = this.getArrData(data);
        this.upDataList(this.addDataToArr(data).concat(this.state.allData),callBack);
    }

    /**
     * 添加到指定的 position 之后
     * 如搜索不到,添加到最后一个/
     * 如要添加到最后,或者最前,使用addFirst addLast 方法
     * @param data 数据对像,或者数据源
     * @param position 非下标 . Item的key
     * @param callBack 添加完成,视图更新回调
     */
    addAfter(data,position,callBack){

        //添加数据,到首位,ID不重新计算
        //由position ,来计算,由position来进行分割数组,并进行添加到中间
        var size =  this.state.allData.length;
        var index = -1;
        for(var i=0;i<size;i++){
            var view = this.state.allData[i];
            if(view.key==position){
                //计算出插入位置
                index = i;
                break;
            }
        }
        log("index:"+index+" size:"+size);

        //如果搜索不到加到最后
        if(index<0){
            this.addLast(data,callBack)
            return;
        }
        //搜索到位置,进行插入
        data = this.getArrData(data);
        this.insert(this.state.allData,index+1,this.addDataToArr(data))
        this.upDataList(this.state.allData,callBack);
    }

    getArrData(data){
        if(data instanceof Array){
            return data;
        }else{
            return [data];
        }
    }
    insert(arr,index, data) {
        var size  = data.length;
        for(var i=0;i<size;i++){
            log(data[size-i-1]);
            arr.splice(index, 0, data[size-i-1]);
        }

    };

    toBottom(callBack){
        if(this.jroll){
            log(this.jroll)
            this.jroll.scrollTo(0, this.jroll.maxScrollY, 200,false,callBack);
        }
    }
    toTop(callBack){
        if(this.jroll){
            this.jroll.scrollTo(0, 0, 200,false,callBack);
        }
    }
    /*
     　 *　方法:Array.remove(dx)
     　 *　功能:删除数组元素.
     　 *　参数:dx删除元素的下标.
     　 *　返回:在原数组上修改数组
     */
    remove(arr,dx)
    {
        if(isNaN(dx)||dx>arr.length){return false;}
        for(var i=0,n=0;i<arr.length;i++)
        {
            if(arr[i]!=arr[dx])
            {
                arr[n++]=arr[i]
            }
        }
        arr.length-=1
    }
    componentDidMount() {

        this.callbackAction(true);


        //返回数据源
        if(this.props.getObject){
            this.props.getObject({
                remove:(index,callBack)=>{
                    this.removeData(index,callBack)
                },
                updateData:(position,data,callBack)=>{
                    this.updateData(position,data,callBack);
                },
                //添加到首位
                addFirst:(data,callBack)=>{
                    this.addFirst(data,callBack);
                },
                //添加到最后
                addLast:(data,callBack)=>{
                    this.addLast(data,callBack);
                },
                //添加到指定位置
                addAfter:(data, position,callBack)=>{
                    this.addAfter(data,position,callBack);
                },
                toTop:(callBack)=>{
                    this.toTop(callBack);
                },
                toBottom:(callBack)=>{
                    this.toBottom(callBack);
                },
                getJroll:()=>{
                    return this.jroll;
                }


            });
        }

        if(this.props.finish){
            //关闭下拉
            this.endData = true;
            this.setShowLoadMsg(this.loadMoreMsgFinshData);
        }

        var jroll = new JRoll("#ls_"+this.idv,{
            scroller:"#sc_"+this.idv,
        });
        this.jroll = jroll;
        // jroll.pulldown({
        //     refresh: (complete) =>{
        //         //刷新
        //     }
        // });

        jroll.scrollTo(0, 0).refresh();
        this.start();

        jroll.on("scroll", ()=> {
            if ((jroll.y-jroll.maxScrollY)<-1) {
                if(this.loadLock){
                    // console.log("加载中,别拉了");
                    this.setShowLoadMsg(this.loadMoreMsgIngTouch);
                }else{
                    this.setShowLoadMsg(this.loadMoreMsgTouch);
                }

            }
        });

        jroll.on("scrollStart", ()=> {
            jroll.refresh();
            if(this.props.scrollStart){
                this.props.scrollStart();
            }
        });
        jroll.on("scrollEnd", ()=> {
            if(this.props.scrollEnd){
                this.props.scrollEnd();
            }
            if ((jroll.y-jroll.maxScrollY)==0) {
                //最底部
                if(this.endData){
                    return;
                }else{
                    this.exeLoad(false);
                }

            }
        });
    }

    exeLoad(refresh){
        //如果正在下载.不进行加载
        log("加载更多"+this.endData)
        if(this.endData){
            return;
        }

        if(this.loadLock){

            // console.log("加载中,请等待");
            if(!(this.state.loadMoreMsg === this.loadMoreMsgIng)){
                this.setShowLoadMsg(this.loadMoreMsgIng);
            }
            return;
        }else{

            if(!(this.state.loadMoreMsg === this.loadMoreMsgDefaut)){

                this.setShowLoadMsg(this.loadMoreMsgDefaut);
            }
        }

        //开始加载
        this.loadLock = true;//标识正在加载
        //提示语
        this.setShowLoadMsg(this.loadMoreMsgIng);
        this.loadMoreData1({
            pageIndex:this.pageIndex,
            refresh:refresh,
            finish:(finish)=>{

                if(finish){
                    //关闭下拉
                    this.endData = true;
                    this.setShowLoadMsg(this.loadMoreMsgFinshData);
                }else{
                    //开启下拉/
                    this.endData = false;
                    this.setShowLoadMsg(this.loadMoreMsgDefaut);
                }
            },
            success:(data)=>{
                this.addSuccessData(data);
            },
            success:(data,callBack)=>{
                this.addSuccessData(data,callBack)
            },
            error:(error)=>{
                //请求错误,显示错误
                //更新高度
                this.jroll.refresh();
                //解锁
                this.loadLock = false;
                //恢复默认
                this.setShowLoadMsg(this.loadMoreMsgDefaut);

            }
        });
    }

    addSuccessData(data,callBack){
        //显示0.2S加载完成
        this.setShowLoadMsg(this.loadMoreMsgFinsh);
        //更新数据
        this.pageIndex=this.pageIndex+1;
        this.upDataList( this.state.allData.concat(this.addDataToArr(data)),callBack);
    }
    setShowLoadMsg(msg){

        if(this.endData){
            msg = this.loadMoreMsgFinshData;
        }
        if(this.state.loadMoreMsg!=msg){
            this.setState({
                loadMoreMsg:msg,
            });
        }

    }

    render(){

        var showNoData = true;
        if(this.state.allData&&this.state.allData.length<1&&this.state.loadMoreMsg==this.loadMoreMsgFinshData){
            showNoData = true;
        }else{
            showNoData = false;

        }
        var noDataCss = showNoData?css.noData:css.hasData;
        return (
            <div
                {...this.props}
            >
                <div className={css.wrapper} id={"ls_"+this.idv} >
                    <div className={css.scroller} id={"sc_"+this.idv} >
                        {this.state.allData}
                        <div
                            onClick={()=>{
                                this.exeLoad(false);
                            }}
                            className={css.more}>{this.state.loadMoreMsg}</div>
                    </div>
                </div>

                <div className={noDataCss}>
                    <div className={noDataCss}>
                        <img src={this.img_defaultView}  className={css.noDataImg}/>
                        <div
                            onClick={()=>{
                            }}
                            className={css.noDataDesc}>{this.props.message?this.props.message:"暂无数据"}</div>
                    </div>
                </div>
            </div>
        );
    }
}

//es6 这两个属性不能写在class内。
ListView.propTypes={//属性校验器，表示改属性必须是bool，否则报错
    start: React.PropTypes.bool,
}
ListView.defaultProps={
    start:false,
    getListData:()=>{},
};//设置默认属性

module.exports = ListView;