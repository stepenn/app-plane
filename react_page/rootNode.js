import React from 'react';

function rootNode(props) {

    console.log("props:");
    console.log(props);
    return <div>
        <div>这是根目录</div>
        <div>{props.children}</div>
    </div>;
}


module.exports = rootNode;