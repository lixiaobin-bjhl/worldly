/*
 * 命令行UI程序
 * 依赖shell
 */
global.shell = require('../lib/shell.js');
var fs = require('fs');
//由app.js传进来的worldly实例
var worldly;

//这个模块的初始化
//参数是worldly模块的实例
exports.init = function(d) {
	worldly = d;
	shell.start(); //准备就绪 开启shell交互
};
// 查看
shell.command('ls', 'less watching files', function(args, next) {
	for (var i in watchFiles){
		shell.print('watching  ' + watchFiles[i]);
	}
	next();
});

shell.command('exit', 'exit wroldly', function(args, next) {
	shell.print('Bye! ^_^');
	process.exit();
});

shell.command('ver', 'less worldly version', function(args, next) {
	fs.readFile(paths.base + '/package.json', 'utf-8', function(err, data) {
		if (err) throw err;
		var r = JSON.parse(data);
		shell.print('version：' + r.version);
		next();
	});
});

// 查看配置文件路径
shell.command('V', 'less config.json path', function(args, next) {
	shell.print('configFilePath: ' + paths.conf + '/' + 'config.json');
	next();
});

// 查看配置文件路径
shell.command('help', 'less help info', function(args, next) {
	var c = shell.commands_list,
	s;
	for (var item in c) {
		s = getCommandSpace(c[item].cname);
		shell.print('  ' + c[item].cname + s + c[item].discribe);
	}
	next();
});

/**
 *为了command help 信息打印整齐，计算cname后面打空格的个数
 **/
function getCommandSpace(cname) {
	var l = 15 - cname.length,
	s = '';

	for (var i = 0; i < l; i++) {
		s += ' ';
	}
	return s;
}

