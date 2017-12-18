import React, { Component } from 'react';
import Help from '../../help/Help';
import ResourcesHelp from '../../tool/ResourcesHelp';

class DemoIncreamentUpdate extends Component {
	constructor(props) {
		super(props);
		this.Help = new Help();
	}

	// openFileSystem(path, resolve, reject) {
	// 	let pathes = path.split('/').filter(val => val !== '');
	// 	plus ? (plus.io.requestFileSystem(plus.io.PRIVATE_DOC,
	// 		// fs.root is a directory entry entity, need to create reader for reading files under fs.root
	// 		(fs) => {
	// 			// alert("File system name: " + (fs.root.name));
	// 			fs.root.getDirectory(pathes[0], { create:false, exclusive:false },
	// 				(dir) => {
	// 					pathes.shift();
	// 					alert(dir.name)
	// 					pathes.length > 0?dir.getDirectory(pathes[0], { create: false, exclusive: false },
	// 						(dir2) => { 
	// 							// under audio folder
	// 							let imageDirectoryReader = dir2.createReader();
	// 							imageDirectoryReader.readEntries(
	// 								(entries) => { 
	// 									entries.forEach(function(val) {
	// 										alert(dir2.name + '\t'+ val.name);
	// 									}, this);
	// 								},
	// 							this.alertErrMessage)
	// 						 },
	// 						this.alertErrMessage
	// 					):void 0; // pathes end, start read file
	// 				 },
	// 				this.alertErrMessage
	// 			)
	// 		},
	// 		this.alertErrMessage)
	// 	) : void 0;
	// }

	// getFiles(type, path, resolve, reject) {
	// 	try {
	// 		let pathes = ('' + path).split('/').filter(val => val !== '');
	// 		!window.plus ? void 0 : (
	// 			plus.io.requestFileSystem(this.getFolderConst(type), (fs) => {
	// 				this.openDirectories(pathes, fs.root, resolve, reject)
	// 			},reject)
	// 		)
	// 	} catch (e) {
	// 		alert(e);
	// 	}
	// }

	// getFolderConst(folderName) {
	// 	let folderList = {
	// 		www: 'PRIVATE_WWW',
	// 		doc: 'PRIVATE_DOC',
	// 		document: 'PUBLIC_DOCUMENTS',
	// 		download: 'PUBLIC_DOWNLOADS',
	// 	};
	// 	return plus.io[folderList[folderName]];
	// }

	// openDirectories(pathes, curDir, resolve, reject) {
	// 	let path = pathes[0];
	// 	pathes.length > 1 ? (
	// 		pathes.shift(), curDir.getDirectory(path, { create: false, exclusive: false },
	// 			(nextDir) => { this.openDirectories(pathes, nextDir, resolve, reject) }, reject)
	// 	) : (
	// 			curDir.getDirectory(path, { create: false, exclusive: false }, (nextDir) => {
	// 				let directoryReader = nextDir.createReader();
	// 				directoryReader.readEntries((entries) => { resolve(nextDir.name, entries)}, reject )
	// 			}, reject)
	// 	)
	// }

	render() {
		let div = (
			<div>
				<br/>
				<br />
				<button onClick={() => {
					ResourcesHelp.getFiles('doc', 'res/audios', (err, dirName, entries) => {
						if (err) {
							return;
						}
						entries.forEach(function (val, i) {
									alert(dirName + '\t' + val.name);
								}, this);})
				}}>Click Me!</button>
			</div>
		)
		return this.Help.app_render(this, div, { full: false })
	}
}

DemoIncreamentUpdate.contextTypes = {
	router: React.PropTypes.object
}

module.exports = DemoIncreamentUpdate;