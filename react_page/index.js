const React = require('react');
const ReactDOM = require('react-dom');
const { Router,Route,IndexRoute,hashHistory }  = require('react-router');
const { createHistory, createHashHistory, useBasename }  = require ('history');
const routes = require("./routes.js");
// var AA =  require("./main/demo/DemoInput.js");
// const routes =<AA/>
ReactDOM.render(routes, document.getElementById("root"));
// const DemoLoadImage = require("./main/demo/DemoLoadImage.js");
// ReactDOM.render(<DemoLoadImage/>, document.getElementById("root"));