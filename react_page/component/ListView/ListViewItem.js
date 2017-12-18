/**
 * Created by lixifeng on 16/11/2.
 */
import React,{Component} from 'react';
class  ListViewItem extends Component{
    componentDidMount() {
    }
    render(){
    // var a = '{{=_obj.index}}、{{=_obj.text}}{{=_obj.msg.abc}}';
        var {data,position} = this.props;
        var st = {
            height:40,
            background:"#7d7d7d",
            marginTop:2,
            fontSize:12,
        };
        return (
        <div
            style={st}
             {...this.props}
        >
            <div onClick={()=>{
            }}>
                点击我{data.title}={position}
            </div>
        </div>
        );
    }
}
module.exports = ListViewItem;