import React, { Component } from 'react';
import HelpI from '../../help/Help'
import AudioHelp from '../../tool/AudioHelp';

class DemoPlayAudio extends Component{
	constructor(props){
		super(props);
		this.Help = new HelpI();
		this.p = new AudioHelp('PrePay');
		// this.p = null;
	}

	componentWillUnmount() {
		this.p.stop();
	}
	
	// playAudio() {
	// 	let filename = AudioList.App.FirstEnter;
	// 	window.plus ? (this.stop(), this.p = plus.audio.createPlayer(filename)) : void 0;
	// 	this.p ? (this.p.play(() => { }, (e) => { alert(e.message) })) : void 0;
	// }
	// stop() {
	// 	this.p ? this.p.stop() : void 0;
	// }

	render() {
		let div = (
			<div>
				<br/>
				<br/>
				<br/>
				<button onClick={() => this.p.play('Order', () => { this.p.play('Finish', () => {this.p.play('ShareAfterOrder') }) })}> Start</button>
				<button onClick={()=> this.p.stop()}>Stop</button>
			</div>
		)
		return this.Help.app_render(this,div,{full:false});
	}
}
DemoPlayAudio.contextTypes = {
    router: React.PropTypes.object
}
module.exports = DemoPlayAudio;