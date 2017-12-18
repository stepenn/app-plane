let ResourcesHelp = {

	/**
	 * Main function to get files under target folder
	 * @param {* io const type; www: 'PRIVATE_WWW',doc: 'PRIVATE_DOC',document: 'PUBLIC_DOCUMENTS',download: 'PUBLIC_DOWNLOADS' } type
	 * @param {* request files in const type} path 
	 * @param {* callback (error, dirName, entries), http://www.html5plus.org/doc/zh_cn/io.html#plus.io.EntrySuccessCallback } callback
	 */
	getFiles: function(type, path, callback) {
		try {
			var pathes = ('' + path).split('/').filter(function (val) { return val !== '' });
			!window.plus ? void 0 : (
				plus.io.requestFileSystem(window.downZip.getFolderConst(type), function(fs){
					window.downZip.openDirectories(pathes, fs.root, callback)
				}, function (e) { callback(e) })
			)
		} catch (e) {
			console.error(e);
		}
	},

	/**
	 * get plus const directory throught short words
	 * @param {* request plus const type, www: 'PRIVATE_WWW',doc: 'PRIVATE_DOC',document: 'PUBLIC_DOCUMENTS',download: 'PUBLIC_DOWNLOADS' } folderName 
	 */
	getFolderConst: function(folderName) {
		var folderList = {
			www: 'PRIVATE_WWW',
			doc: 'PRIVATE_DOC',
			document: 'PUBLIC_DOCUMENTS',
			download: 'PUBLIC_DOWNLOADS',
		};
		return plus.io[folderList[folderName]];
	},

	/**
	 * recursive directory request when pathes array is not remain one
	 * @param {* request path array} pathes
	 * @param {* current directory entity} curDir
	 * @param {* callback,(error, dirName, entries)} callback
	 */
	openDirectories: function(pathes, curDir, callback) {
		var path = pathes[0];
		pathes.length > 1 ? (
			pathes.shift(), curDir.getDirectory(path, { create: false, exclusive: false },
				function (nextDir) { window.downZip.openDirectories(pathes, nextDir, callback) }, function (e) { callback(e) })
		) : (
				curDir.getDirectory(path, { create: false, exclusive: false }, function(nextDir){
					var directoryReader = nextDir.createReader();
					directoryReader.readEntries(function (entries) { callback(null, nextDir.name, entries) }, function (e) { callback(e) })
				}, function (e) { callback(e) })
			)
	},
}

module.exports = ResourcesHelp