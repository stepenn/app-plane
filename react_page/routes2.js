import React from 'react'
import { Router,hashHistory,Route, IndexRoute,browserHistory} from 'react-router';
//组织结构
import App from './main/App.js';

let route = {
    getRoute(){
        //能力演示
        return (
          <Route path="/" component={App}>
          </Route>
        );
    }
}
const root =
    <Router  history={hashHistory} >{route.getRoute()}</Router>
;
module.exports = root;


