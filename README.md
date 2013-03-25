worldly
=======

在前端开发过程中，开发时需要模块颗粒化，发布时文件又需要整合。worldly为你解决合并文件，压缩文件，实时检测文件发现变化。
>支持mac linux windows操作系统。

>在nodejs v0.8.18平台上开发。

>文档及功能在完善当中，有问题可以联系我。(email:lixiaobin8878@gmail.com qq:516908542)


主要功能
-------

在工作目录(workspace)开发功能模块时，时实检测文件变化将修改的文件重新编译到静态发布目录（buildspace）。

实时压缩静态文件（js css）,保证本地代码与线上代码发保持一到。

手动合并压缩静态文件, 减少静态http请求的数量和代码体积。


使用方法
--------

###安装
安装node和npm
``` bash
	$ [sudo] npm install wroldly -g
```
安装git 

``` bash
	$ git clone https://github.com/lixiaobin8878/worldly.git 
```
###使用方法
* 在命令行中输入Ｖ查看package.json文件的路径，修改配置文件
* 在系统终端执行 worldly

###命令行说明
* exit  退出worldly
* help  查看帮助
* ls    查看监控的文件
* ver   查看worldly 的版本号
* V     查看配置文件的路径





