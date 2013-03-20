/**
 * combine and minijs 
 * @fineIn{string or array} readFilePath
 * @fileOut(string) writeFilePath
 * */
var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var cleanCSS = require('clean-css');
var path = require('path');

//准备一些常用路径
var dir_base = path.resolve(__dirname + '/../'); //程序根目录
var paths = {
	base: dir_base,
	conf: path.resolve(dir_base + '/conf'),
};
global.watchFiles = [];
/*
 * css 输出函数
 * @fileIn{array} 输出源
 * @fileOut{string}输出target
 * */
function cssMinifier(flieIn, fileOut) {
	var files = Array.isArray(flieIn) ? flieIn: [flieIn];
	pushToWatchFile(files);
	var origCode, finalCode = '';
	for (var i = 0; i < files.length; i++) {
		origCode = fs.readFileSync(config.workPath +  files[i], 'utf8');
		finalCode += cleanCSS.process(origCode);
	}
	fs.writeFileSync(config.buildPath + fileOut, finalCode, 'utf8');
}

/*
 * js 输出函数
 * @fileIn{array} 输出源
 * @fileOut{string}输出target
 * */
function jsMinifier(fileIn, fileOut) {
	var files = Array.isArray(fileIn) ? fileIn: [fileIn];
	pushToWatchFile(files);
	var origCode, ast, finalCode = '';
	for (var i = 0; i < files.length; i++) {
		origCode = fs.readFileSync(config.workPath + files[i], 'utf8');
		ast = jsp.parse(origCode);
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		finalCode += ';' + pro.gen_code(ast);
	}
	fs.writeFileSync(config.buildPath + fileOut, finalCode, 'utf8');
}

fs.readFile(paths.conf + '/config.json', 'utf-8', function(err, data) {
	if (err) throw err;
	global.config = JSON.parse(data);
	for (var item in config.combinJS) {
		jsMinifier(config.combinJS[item].fileIn, config.combinJS[item].fileOut);
	}

	for (var item in config.combinCSS) {
		cssMinifier(config.combinCSS[item].fileIn, config.combinCSS[item].fileOut);
	}
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
				console.log('Compiled: ' + typeFiles[item].fileOut);
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
		console.log('Modified: ' + file + ' ' + curr.mtime.toUTCString());
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

process.on('exit', function() {
	console.log('exit lalala~~~');
});

process.on('uncaughtException', function(err) {
	console.log(err.stack);
});

// 检测信号
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
	if (chunk.trim() == 'watch') {
		console.log('watching file', watchFiles);
	}
});

