/**
 * combine and minijs 
 * @param fineIn{string or array} readFilePath
 * @param fileOut(string) writeFilePath
 * */
var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var cleanCSS = require('clean-css');
var path = require('path');
var coli = require('./commandline.js');
var UglifyJS = require("uglify-js");

//准备一些常用路径
var dir_base = path.resolve(__dirname + '/../'); //程序根目录
global.paths = {
	base: dir_base,
	conf: path.resolve(dir_base + '/conf'),
};
global.watchFiles = [];
/*
 * css 输出函数
 * @param fileIn{array} 输出源
 * @param fileOut{string}输出target
 * */
function cssMinifier(flieIn, fileOut) {
	var files = Array.isArray(flieIn) ? flieIn: [flieIn],
	origCode,
	finalCode = '',
	p;
	pushToWatchFile(files);
	for (var i = 0; i < files.length; i++) {
		p = path.resolve(config.workPath + files[i]);
		if (!fs.existsSync(p)) {
			console.error('cannot find file ' + p);
			return;
		}
		origCode = fs.readFileSync(p, 'utf8');
		finalCode += cleanCSS.process(origCode);
	}
	fs.writeFileSync(config.buildPath + fileOut, finalCode, 'utf8');
}

/*
 * js 输出函数
 * @param fileIn{array} 输出源
 * @param fileOut{string}输出target
 * */
function jsMinifier(fileIn, fileOut) {
	var files = Array.isArray(fileIn) ? fileIn: [fileIn],
	p,
	length = files.length,
	l = [];
	pushToWatchFile(files);
	for (var i = 0; i < length; i++) {
		p = path.resolve(config.workPath + files[i]);
		if (!fs.existsSync(p)) {
			console.error('cannot find file ' + p);
			return;
		}
		l.push(p);
		//origCode = fs.readFileSync(p, 'utf8');
		//ast = jsp.parse(origCode);
		//ast = pro.ast_mangle(ast);
		//ast = pro.ast_squeeze(ast);
		//finalCode += ';' + pro.gen_code(ast);
	}
	//fs.writeFileSync(config.buildPath + fileOut, finalCode, 'utf8');
	var r = UglifyJS.minify(l);
	fs.writeFileSync(config.buildPath + fileOut, r.code, 'utf8');
}

/*
 * 创建文件夹
 * param path{string} 需要创建文件夹的路径
 **/
function createDir(p) {
	var p = path.resolve(p);
	if (!fs.existsSync(p)) {
		try {
			fs.mkdirSync(p, 0777);
			shell.print('mkdir: ' + p);
		} catch(e) {
			console.log(e.stack);
		}
	}
}

fs.readFile(paths.conf + '/config.json', 'utf-8', function(err, data) {
	if (err) throw err;
	global.config = JSON.parse(data);
	createDir(config.buildPath);
	createDir(config.workPath);
	for (var item in config.combinJS) {
		jsMinifier(config.combinJS[item].fileIn, config.combinJS[item].fileOut);
	}
	for (var item in config.combinCSS) {
		cssMinifier(config.combinCSS[item].fileIn, config.combinCSS[item].fileOut);
	}
	console.log('worldly ready！configFilePath：' + paths.conf + '/config.json');
	coli.init();
});

/**
 * get the file type
 *@param{string} filename path
 * */
function getFileType(file) {
	var lastPointIndex = file.lastIndexOf('.');
	return file.substring(lastPointIndex + 1).toLowerCase();
}

/**
 *检测文件的发变，重新编议文件
 * */
function updateByWatchFile(file) {
	var type = getFileType(file),
	combinType,
	typeFiles,
	f;
	if (type == 'css') {
		combinType = 'combinCSS';
		f = cssMinifier;
	} else if (type == 'js') {
		combinType = 'combinJS';
		f = jsMinifier;
	} else {}
	typeFiles = config[combinType];
	for (var item in typeFiles) {
		for (var i in typeFiles[item].fileIn) {
			if (typeFiles[item].fileIn[i] == file) {
				f(typeFiles[item].fileIn, typeFiles[item].fileOut);
				shell.prompt();
				console.log('Compiled: ' + paths.base + config.buildPath + typeFiles[item].fileOut);
				shell.prompt();
				break;
			}
		}
	}
}

//  查看一个元素是否在一个数组里面
function itmeHasInArray(item, array) {
	var r = false;
	for (var i in array) {
		if (array[i] == item) {
			r = true;
			break;
		}
	}
	return r;
}

function WatchFilesManage(file) {
	this.file = file;
	this.init();
}

WatchFilesManage.prototype.init = function() {
	this.watchFileChange(this.file);
}

// 检测零散的文件变化
WatchFilesManage.prototype.watchFileChange = function(file) {
	fs.watchFile(path.resolve(config.workPath + file), function(curr, prev) {
		console.log('Modified: ' + paths.base + file + ' ' + curr.mtime.toUTCString());
		updateByWatchFile(file);
	});
}

function pushToWatchFile(files) {
	for (var item in files) {
		if (!itmeHasInArray(files[item], watchFiles)) {
			var file = files[item];
			watchFiles.push(file);
			new WatchFilesManage(file);
		}
	}
}

process.on('uncaughtException', function(err) {
	console.log(err.stack);
});

