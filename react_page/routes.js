import React from 'react'
import { Router,hashHistory,Route, IndexRoute,browserHistory} from 'react-router';
//组织结构
import App from './main/App.js';
import User from './main/user/User.js';
import SocialBar from './main/social/SocialBar.js';

//用户页面
import UserInfo from './main/user/UserInfo.js';
import AlterPersonInfor from './main/user/detail/AlterPersonInfor.js';
import MySign from './main/user/detail/MySign.js';
import AddSign from './main/user/detail/AddSign.js';

import PersonDetail from './main/user/PersonDetail.js';
import VerTeamer from './main/user/certification/VerTeamer.js';
import CerID from './main/user/certification/CerID.js';



import UserInfoShow from './main/user/UserInfoShow.js';
import MyPeriodization from './main/user/MyPeriodization.js';

//我的乘机人
import MyPlane from './main/user/MyPlane.js';
import AddPlanePer from './main/user/detail/AddPlanePer.js';

//我的行程
import MyTeam from './main/user/MyTeam.js';
import MyTrip from './main/user/MyTrip.js';
import TicketState from './main/user/detail/TicketState.js';
import TripDetail from './main/user/detail/TripDetail.js';
import TicketInforDesc from './main/user/detail/TicketInforDesc.js'
import OrderDetail from './main/user/detail/OrderDetail.js';
import PrePay from './main/user/pay/PrePay.js';

import Feedback from './main/user/Feedback.js';
import Setting from './main/user/Setting.js';
import AboutAiPinJi from "./main/user/detail/AboutAiPinJi.js"
import Login from './main/user/login/Login.js';
import Regist from './main/user/login/Regist.js';
import AlterPW from './main/user/login/AlterPW.js';
import BindPhone from './main/user/login/BindPhone.js';


//公用页面
import SelectCity from './main/public/SelctCity/SelectCity.js';
import SelectCityList from './main/public/SelctCity/SelectCityList.js';



//主页
import BeginCity from './main/index/beginCity/beginCity.js';
import EndCity from './main/index/EndCity/EndCity.js';
import Ticket from './main/index/ticket/ticket.js';
import FriendSelect from './main/index/FriendSelect/FriendSelect.js';
import Agreement from './main/index/ticket/Agreement/Agreement.js';
import MoreFlights from './main/index/ticket/MoreFlights/MoreFlights.js';
import Siege from './main/index/Siege/Siege.js';
import TripDetails from './main/index/TripDetails/TripDetails.js';
import MoreMember from './main/index/TripDetails/MoreMember/MoreMember.js';
import Employees from './main/index/MyLeaderTeam/Employees.js';

import PublicTeamTrip from './main/user/PublicTeamTrip.js';

//社交页面
import AddDesire from './main/social/desire/AddDesire.js';
import DesireDetail from './main/social/desire/DesireDetail.js';
import DesireShare from './main/social/desire/DesireShare.js';
import MessageInfo from './main/social/message/MessageInfo.js';
import Telephone from './main/social/friends/Telephone.js';
import Recommend from './main/social/friends/Recommend.js';
import VerFriend from './main/social/friends/VerFriend.js';
//测试页面0
import Demo from './main/demo/Demo.js';
import DemoIncreamentUpdate from './main/demo/DemoIncreamentUpdate';
import DemoPlayAudio from './main/demo/DemoPlayAudio';
import DemoLoadImage from './main/demo/DemoLoadImage.js';
import DemoBar from './main/demo/DemoBar.js';
import DemoNative from './main/demo/DemoNative.js';
import DemoParameter from './main/demo/DemoParameter.js';
import DemoDiyBar from './main/demo/DemoDiyBar.js';
import DemoCallBack from './main/demo/DemoCallBack.js';
import DemoCallBack2 from './main/demo/DemoCallBack2.js';
import DemoNoAnim from './main/demo/DemoNoAnim.js';
import DemoAnimUp from './main/demo/DemoAnimUp.js';
import DemoPageScroll from './main/demo/DemoPageScroll.js';
import DemoPageListView from './main/demo/DemoPageListView.js';
import DemoPageDialog from './main/demo/DemoPageDialog.js';
import DemoPageHttp from './main/demo/DemoPageHttp.js';
import DemoShare from './main/demo/DemoShare.js';
import DemoLogin from './main/demo/DemoLogin.js';
import DemoLocation from './main/demo/DemoLocation.js';
import DemoPay from './main/demo/DemoPay.js';
import DemoContacts from './main/demo/DemoContacts.js';
import DemoImage from './main/demo/DemoImage.js';

import GuidePage from './main/GuidePage'

let route = {
    getRoute(){
        //能力演示
        var demo =
            <Route path="/Demo" component={Demo}>
                <Route path="DemoIncreamentUpdate" component={DemoIncreamentUpdate}></Route>
                <Route path="DemoPlayAudio" component={DemoPlayAudio}></Route>
                <Route path="DemoLoadImage" component={DemoLoadImage}/>
                <Route path="DemoNative" component={DemoNative}/>
                <Route path="DemoImage" component={DemoImage}/>
                <Route path="DemoContacts" component={DemoContacts}/>
                <Route path="DemoPay" component={DemoPay}/>
                <Route path="DemoLocation" component={DemoLocation}/>
                <Route path="DemoLogin" component={DemoLogin}/>
                <Route path="DemoShare" component={DemoShare}/>
                <Route path="DemoPageHttp" component={DemoPageHttp}/>
                <Route path="DemoPageDialog" component={DemoPageDialog}/>
                <Route path="DemoPageListView" component={DemoPageListView}/>
                <Route path="DemoPageScroll" component={DemoPageScroll}/>
                <Route path="DemoBar" component={DemoBar}/>
                <Route path="DemoParameter" component={DemoParameter}/>
                <Route path="DemoDiyBar" component={DemoDiyBar}/>
                <Route path="DemoNoAnim" component={DemoNoAnim}/>
                <Route path="DemoAnimUp" component={DemoAnimUp}/>
                <Route path="DemoCallBack" component={DemoCallBack}>
                    <Route path="DemoCallBack2" component={DemoCallBack2}/>
                </Route>
            </Route>;

        //登录功能页面
        var login =<Route path="Login" component={Login}>
            <Route path="Regist" component={Regist}/>
            <Route path="BindPhone" component={BindPhone}/>
        </Route>;

        //聊天页面
        var messageInfo = <Route path="MessageInfo" component={MessageInfo}>
                    <Route path="PersonDetail" component={PersonDetail}/>
                </Route>;

        //显示用户信息面板页面
        var userInfoShow =
            <Route path="UserInfoShow" component={UserInfoShow}>
                {messageInfo}
            </Route>;

        var prePay =  <Route path="PrePay" component={PrePay}>
            <Route path="TicketInforDesc" component={TicketInforDesc}/>
            <Route path="MyPlane" component={MyPlane}>
                <Route path="AddPlanePer" component={AddPlanePer}/>
            </Route>
        </Route>;

        var myTrip =  <Route path="MyTrip" component={MyTrip}>
            {prePay}
            <Route path="TripDetail" component={TripDetail}>
                <Route path="TicketInforDesc" component={TicketInforDesc}>
                    {prePay}
                </Route>
                <Route path="OrderDetail" component={OrderDetail}>
                    {prePay}
                </Route>
            </Route>
            <Route path="TicketState" component={TicketState}>
                <Route path="MyPlane" component={MyPlane}>
                    <Route path="AddPlanePer" component={AddPlanePer}/>
                </Route>
                <Route path="AddPlanePer" component={AddPlanePer}/>
            </Route>
        </Route>;

        var myTeam =  <Route path="MyTeam" component={MyTeam}>
            <Route path="Siege" component={Siege}/>
            <Route path="Employees" component={Employees}>
                <Route path="PersonDetail" component={PersonDetail}/>
            </Route>
            <Route path="TripDetail" component={TripDetail}>
                <Route path="TicketInforDesc" component={TicketInforDesc}/>
            </Route>
            <Route path="PublicTeamTrip" component={PublicTeamTrip}>
                {prePay}
                <Route path="BeginCity" component={BeginCity}/>
                <Route path="EndCity" component={EndCity}/>
                <Route path="FriendSelect" component={FriendSelect}/>
                <Route path="Ticket" component={Ticket}>
                    <Route path="Agreement" component={Agreement}/>
                    <Route path="MoreFlights" component={MoreFlights}/>
                </Route>
                <Route path="Siege" component={Siege}/>
            </Route>
            {prePay}
        </Route>;
        var verTeamer = <Route path="VerTeamer" component={VerTeamer}>
            <Route path="CerID" component={CerID}/>
            <Route path="SelectCityList" component={SelectCityList}/>
        </Route>;
        return (
          <Route path="/" component={App}>
              {verTeamer}
              <Route path="DesireShare" component={DesireShare}/>
              <Route path="GuidePage" component={GuidePage}/>

              <Route path="SelectCity" component={SelectCity}/>

              <Route path="SocialBar" component={SocialBar}>
                  {messageInfo}
                  {userInfoShow}
                  {login}
                  <Route path="AddDesire" component={AddDesire}/>

                  <Route path="DesireDetail" component={DesireDetail}>
                      <Route path="PersonDetail" component={PersonDetail}/>
                  </Route>

                  <Route path="Recommend" component={Recommend}>
                      <Route path="PersonDetail" component={PersonDetail}/>
                  </Route>
                  <Route path="VerFriend" component={VerFriend}>
                      <Route path="PersonDetail" component={PersonDetail}/>
                  </Route>
                  <Route path="Telephone" component={Telephone}>
                      <Route path="PersonDetail" component={PersonDetail}/>
                    </Route>
                  <Route path="PersonDetail" component={PersonDetail}/>
              </Route>
              <Route path="User" component={User}>
                  {myTrip}
                  {login}
                  {userInfoShow}
                  <Route path="UserInfo" component={UserInfo}>
                      <Route path="SelectCityList" component={SelectCityList}/>
                      <Route path="AlterPersonInfor" component={AlterPersonInfor}/>
                      <Route path="MySign" component={MySign}>
                          <Route path="AlterPersonInfor" component={AlterPersonInfor}/>
                          <Route path="AddSign" component={AddSign}/>
                      </Route>
                  </Route>
                  <Route path="MyPeriodization" component={MyPeriodization}/>
                  <Route path="MyPlane" component={MyPlane}>
                      <Route path="AddPlanePer" component={AddPlanePer}/>
                  </Route>
                  {myTeam}
                  <Route path="Feedback" component={Feedback}/>
                  <Route path="Setting" component={Setting}>
                      <Route path="AboutAiPinJi" component={AboutAiPinJi}/>
                      <Route path="AlterPW" component={AlterPW}/>
                      {login}
                  </Route>

                  {verTeamer}
              </Route>

              {demo}
              {login}
              {prePay}
              {myTrip}
              {myTeam}
              <Route path="BeginCity" component={BeginCity}/>
              <Route path="EndCity" component={EndCity}/>
              <Route path="FriendSelect" component={FriendSelect}/>
              <Route path="Ticket" component={Ticket}>
                  <Route path="Agreement" component={Agreement}/>
                  <Route path="MoreFlights" component={MoreFlights}/>
              </Route>
              <Route path="Siege" component={Siege}/>
              <Route path="TripDetails" component={TripDetails}>
                  {login}

                  {prePay}
                  <Route path="FriendSelect" component={FriendSelect}>

                  </Route>
                  <Route path="MoreMember" component={MoreMember} >
                      <Route path="PersonDetail" component={PersonDetail}/>
                  </Route>
                  <Route path="PersonDetail" component={PersonDetail}/>
              </Route>
          </Route>
        );
    }
}
const root =
    <Router  history={hashHistory} >{route.getRoute()}</Router>
;
module.exports = root;


