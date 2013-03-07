/**
 * combine and minijs 
 * @fineIn{string or array} readFilePath
 * @fileOut(string) writeFilePath
 * */
var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify; 
 
function jsMinifier(flieIn, fileOut) {
     var flieIn=Array.isArray(flieIn)? flieIn : [flieIn];
     var origCode,ast,finalCode='';
     for(var i=0; i<flieIn.length; i++) {
        origCode = fs.readFileSync(flieIn[i], 'utf8');
        ast = jsp.parse(origCode);
        ast = pro.ast_mangle(ast);
        ast= pro.ast_squeeze(ast); 
        finalCode +=';'+ pro.gen_code(ast);
     }
    fs.writeFileSync("build/" + fileOut, finalCode, 'utf8');
}

fs.readFile(__dirname + "/conf/config.json",'utf-8', function(err,data){
	if (err) throw err;
	var json = JSON.parse(data);
	for (var item in json) {
		jsMinifier(json[item].fileIn,json[item].fileOut);
	}
});

fs.watchFile('1.js',function(curr,prev){
	console.log('the current mtime is: ' + curr.mtime);
	console.log('the previous mtime was: ' + prev.mtime);
});

