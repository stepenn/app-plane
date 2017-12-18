// const AudioList = {
// 	App: {
// 		FirstEnter: '_doc/res/audios/aud_op.aac'
// 	},
// 	PublicTeamTrip: {
// 		StartCreate: '_doc/res/audios/aud_createTrip.aac',
// 		Success: '_doc/res/audios/aud_createTripSuccess.aac',
// 	},
// 	TripDetails: {
// 		Half: '_doc/res/audios/aud_invitedReach15.aac',
// 		Complete: '_doc/res/audios/aud_desireCompleted.aac',
// 	},
// 	PrePay: {
// 		Order: '_doc/res/audios/aud_prePaySuccess.aac',
// 		Finish: '_doc/res/audios/aud_prePaySuccess.aac',
// 	},
// 	MyTeam: {
// 		reqSuccess: '_doc/res/audios/aud_reqLeaderSuccess.aac',
// 		reqFailure: '_doc/res/audios/aud_reqLeaderFailure.aac',
// 	},
// 	ticket: {
// 		DateSelection: '_doc/res/audios/aud_createTripSelectStart.aac'
// 	},
// }

class AudioHelp {

	/**
	 * Audio Helper Constructor
	 * @param {* the page to call audio} page 
	 */
	constructor(page) {
		this.p = null;
		var audioList = {
			App: {
				FirstEnter: '_doc/res/audios/aud_op.aac'
			},
			IndexRight: {
				StartCreate: '_doc/res/audios/aud_createTrip.aac',
			},
			TripDetails: {
				Half: '_doc/res/audios/aud_invitedReach15.aac',
				Complete: '_doc/res/audios/aud_desireCompleted.aac',
			},
			PrePay: {
				Order: '_doc/res/audios/aud_prePaySuccess.aac',
				ShareAfterOrder: '_doc/res/audios/aud_createTripSuccess.aac',
				Finish: '_doc/res/audios/aud_payEnd.aac',
			},
			MyTeam: {
				reqSuccess: '_doc/res/audios/aud_reqLeaderSuccess.aac',
				reqFailure: '_doc/res/audios/aud_reqLeaderFailure.aac',
			},
			ticket: {
				DateSelection: '_doc/res/audios/aud_createTripSelectStart.aac'
			},
		}
		this.page = audioList[page];
	}

	/**
	 * 
	 * @param {* audio file situation} audioType 
	 * @param {* success callback} resolve 
	 * @param {* failure callback} reject 
	 */
	play(audioType, resolve, reject) {
		// directly return skip play
		return;
		// TODO: restore code below to fix audio play
		// if (!this.page) {
		// 	return;
		// }
		// let playAudioType = audioType ? audioType : Object.keys(this.page)[0];
		// window.plus ? (this.stop(),
		// 	this.p = plus.audio.createPlayer(this.page[playAudioType]),
		// 		this.p.play(resolve,reject))
		// 	: void 0;
	}

	stop() {
		this.p ? this.p.stop() : void 0;
	}
}

module.exports = AudioHelp;