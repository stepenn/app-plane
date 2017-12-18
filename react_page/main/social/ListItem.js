import React, { Component } from 'react';
import HelpI from '../../help/Help'
import css from './ListItem.less';

export default class ListItem extends Component{
	constructor(props) {
		super(props);
		this.help = new HelpI();
		this.bgAvatarRing = window.imgHost + '/images/bg_head_ring.png';
		this.img_err = window.imgHost + '/images/icon_logo.png';
		this.src = props.messageBody.avatar;
		this.state = {
			imgStat: 1,
			options: props.options
		}
	}
	handleFriendsClick(i, main, e) {
		e.preventDefault();
		main(e, this.props.position, () => this.setState((preState) => {
			return {
				options:{
						type: 1,
						payload: {
							text: preState.options.payload.text.split(',')[i]
						}
					}
				}
			})
		);
	}
	handleIconClick(messageBody, main, e) {
		e.preventDefault();
		main(e,messageBody);
	}
	handlePersonDetail(e, messageBody) {
		e.preventDefault();
		let main = this.state.options.showInfo;
		main ? (main.event(e, messageBody, (text) => this.setState((preState) => {
			return {
				options: {
					type: 1,
					payload: {
						text: text
					}
				}
			}
		}))) : void 0;
	}
	handleIMG(code) {
		this.setState({
			imgStat: code
		})
	}
	render() {
		// alert(JSON.stringify(this.state));
		let { messageBody } = this.props,
			{ type, payload } = this.state.options,
			isMsgExist = (messageBody.message !== undefined && messageBody.message !== ''),
			msgBody = (
				<div className={css.listitem_content} onClick={(e) => this.handlePersonDetail(e,messageBody)}>
					<div className={isMsgExist ? css.listitem_nickname__comment : css.listitem_nickname}>
						{messageBody.nickName}
					</div>
					
					{isMsgExist ? <div className={css.listitem_message}>{messageBody.message}</div> :
						void 0}
					
				</div>),
			msgEnd = type < 2 ?
				(<div className={css.listitem_end}>
						{type ? (payload.text.length>0 ?
							<ListText text={payload.text}></ListText> :
							null
						) :
							payload.buttons.map((val, i) =>
								<ListButton key={i} clickEvent={(e) => this.handleFriendsClick(i, val.event, e)} text={val.text} ></ListButton>
								)}
				</div>) :
				(type == 2 ? (<div className={css.listitem_end_icon}>
					{payload.icons.map((val, i) =>
						<div key={i} className={css.listitem_endIcon}
							onClick={(e) => this.handleIconClick(messageBody, val.event, e)}>
							<div className={css.listitem_endIcon__icon}><img src={val.iconUrl} alt="" /></div>
							<div className={css.listitem_endIcon__text}>{val.text}</div>
						</div>)}
					</div>) :
					<div></div>)
		return (
			<div className={css.cell}>
				<div className={css.listitem} >
					<div className={css.listitem_avatar} onClick={(e) => this.handlePersonDetail(e,messageBody)}>
						<div className={css.listitem_avatar__ring} style={{
                            backgroundImage:`url(${this.bgAvatarRing})`
                        }}></div>
						<img src={this.state.imgStat ? this.src : this.img_err} onError={() => {
                            this.handleIMG(0);
                        }} alt=""/>
					</div>
                    {msgBody}
                    {msgEnd}
				</div>
			</div>)
	}
}

class ListButton extends Component{
	constructor(props) {
		super(props);
		this.bg_label = window.imgHost + '/images/bg_label.png';
	}
	render() {
		let { clickEvent,text } = this.props;
		return (
			// <div className={css.listitem_end__button}>
			<button style={{
				background: `url(${this.bg_label}) no-repeat`,
				backgroundSize: 'cover'
				}} onClick={(e)=>clickEvent(e)} >
				{text}
			</button>
			// </div>
		)
	}
}

class ListText extends Component{
	render() {
		let { text } = this.props;
		return (
			<span className={css.listitem_end__text} >
				{text}
			</span>
		)
	}
}