/**
 * Created by lixifeng on 17/6/13.
 * 下载资源包到本地
 */


var downZip = {

	/**
	 * 验证是否需要下载新的资源包
	 */
	verVersion: function (proBack, msgBack, finishBack) {


		var isDiff = false;
		 window.imgHost = "http://localhost:13131/_doc/res"; // local static resource address
		var resVer = plus.storage.getItem("resVersion");
		if (!resVer) {
			resVer = 0;
		}
		// alert("当前资源版本号:" + resVer + '\t' + typeof resVer);
		msgBack("当前资源版本号:" + resVer);
		// TODO: restore location origin
		var checkUrl ="";

		if(isDiff){
            checkUrl =  window.location.origin + "/api/common/updateResDiff";
		}else{
            checkUrl = window.location.origin + "/api/updateWebRes";
		}
		var xhr = new plus.net.XMLHttpRequest();
		
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case 4:
					if (xhr.status == 200) {
						var info = xhr.responseText;
						var obj = null;
						try {
							//     vcode: "999",版本号
							//         isIncrement: 0,是否增量
							//         url: "http://10.0.0.89:3000/upData/apin.wgt",下载地址
							//         code: 1 是否成功
							obj = JSON.parse(info);
						} catch (e) {
							obj = { data: {}};
						}
						var newVer ;
							if(isDiff){
                                newVer = obj.data.newVersion;
							}else{
                                newVer = obj.vcode;
							}

						msgBack("资源版本号:" + newVer);
						// TODO: temperoray enable update
						// if (obj.code == 1 && resVer<newVer) {
						if(isDiff){
                            if ('url' in obj.data) {
                                window.downZip.downFile(newVer, obj.data.url, proBack, msgBack, finishBack);  // 下载升级包
                            } else {
                                msgBack("资源包完整！");
                                finishBack();
                            }
						}else{
                            if (obj.code == 1 && resVer<newVer) {
                                window.downZip.downFile(newVer, obj.url, proBack, msgBack, finishBack);  // 下载升级包
                            } else {
                                msgBack("资源包完整！");
                                finishBack();
                            }
						}

					} else {
						msgBack("检测更新失败！");
						finishBack();
					}
					break;
				default:
					break;
			}
		}

		xhr.timeout = 30000;  // 设置极小的超时时间用于处罚ontimeout事件

		xhr.ontimeout = function () {
			// xhr请求超时事件处理
			finishBack();
		};
		xhr.open("POST", checkUrl);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// 发送HTTP请求
        if(isDiff){
            var folderList = ['res/audios', 'res/images'];
            // $data: { $folderName: string: $filenameArray: [$filename:string] }
            var done = window.downZip.pedding(function (data) {
                // alert(JSON.stringify(data))
                var reqSrcArr = [], param = { userResList: [], version: resVer },
                    key = null, paramsFormated = "", tmpfileArray=[];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        tmpfileArray = data[key];
                        reqSrcArr = reqSrcArr.concat(
                            window.downZip.getTargetFolderFileArr(key, tmpfileArray));
                    }
                }
                param.userResList = reqSrcArr;
                paramsFormated = window.downZip.a(param);
                // alert(paramsFormated);
                xhr.send(paramsFormated);
            })
            for (var i = 0; i < folderList.length; i++) {
                window.downZip.getFiles('doc', folderList[i], done(folderList[i]))
            }
		}else{
            xhr.send();
		}

	},

	/**
	 * format request parameter
	 * @param {* parameter} b
	 */
	a: function (b) {
		var i = 0, d = "", e = null;
		for (e in b) {
			// d += i++ == 0 ? (e + "=" + b[e]) : ('&' + e + '=' + b[e]);
			d += b[e] instanceof Object ? (
					i == 0 ? (e + '=' + JSON.stringify(b[e])) : ('&' + e + '=' + JSON.stringify(b[e]))
				) : (
					i == 0 ? (e + '=' + b[e]) : ('&' + e + '=' + b[e])
				), i++;
		}
		return d;
	},

	downFile: function (newVer, url, proBack, msgBack, finishBack) {
		// url = "http://10.0.0.89:3000/upData/res.zip";
		var options = { method: "GET" };
		// alert('url: ' + url);
		var dtask = plus.downloader.createDownload(url, options);
		dtask.addEventListener("statechanged", function (task, status) {
			if (!dtask) {
				return;
			}
			switch (task.state) {
				case 1: // 开始
					msgBack("开始提取...");
					break;
				case 2: // 已连接到服务器
					msgBack("发现资源...");
					break;
				case 3:	// 已接收到数据
					var persent = (Math.ceil((task.downloadedSize / task.totalSize) * 100))
					if (persent >= 100) {
						persent = 100;
					}
					proBack(persent);
					break;
				case 4:	// 下载完成
					msgBack("提取完成,开始装载！");
					window.downZip.zipDecompress(newVer, task.filename, proBack, msgBack, finishBack);
					break;
				default:

			}
		}, false);
		dtask.start();
	},
	//解压缩
	zipDecompress: function (newVer, zipfile, proBack, msgBack, finishBack) {
		var targetPath = '_doc/res/';
		plus.zip.decompress(zipfile, targetPath,

			function () {
				msgBack("解压完成");
				plus.storage.setItem("resVersion", newVer);
				finishBack(true);

			},

			function (error) {
				msgBack(JSON.stringify(error));
				finishBack();

			});
	},

	getTargetFolderFileArr: function (dirName, entries) {
		return (dirName !== undefined && entries !== undefined) ? entries.map(function (val) {
			return {
				directory: dirName,
				name: val
			}
		}) : [];
	},
	
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

	pedding: function (callback) {
		var count = 0, result = {};
		return function (key) {
			count++;
			// alert(count);
			return function (err, dirName, entries) {
				count--;
				// alert(count);
				// err ? alert(err.message) : void 0;
				result[dirName] = entries.map(function (val) {
					return val.name
				})
				if (count == 0) {
					callback(result);
				}
			}
		}
	},

	errInfo: function(e) {
		console.error(e.message)
	}
}

// window.downZip = downZip;

// module.exports = downZip;