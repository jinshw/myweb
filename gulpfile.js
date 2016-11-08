var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var routeList = require('./config/route.json');
var sequence = require('gulp-sequence');

//路径
var path = {
	htmlHead:'src/html/head.html',
	htmlFoot:'src/html/foot.html',
	jsCore:'src/core/*.js',
	jsTool:'src/tool/**/*.js',
	pagelet:'src/pagelet/',
	jsStart:'src/start/*.js',
	htmlDist:'dest/staticpage',
	jsDist:'dest/static/js',
	cssDist:'dest/static/css'
}


// 1、合并HTML文件
gulp.task('concatHTML',function(){
	return routeList.routelist.forEach(function(route){
		var a = [path.htmlHead];
		route.pagelet.forEach(function(pname){
			var _n = pname.split('-').join('.');
			var _path = path.pagelet+'data/'+_n+".html";
			a.push(_path);
		});

		var htmlPaths = a.concat(path.htmlFoot);
		gulp.src(htmlPaths)
		.pipe(concat(route.path+'.html'))
		.pipe(replace(/__TITLE__/,route.title))
		.pipe(replace(/__PATH__/g,route.path))
		.pipe(gulp.dest(path.htmlDist));

	});
});

// 2、合并js
gulp.task('concatJS',function(){
	return routeList.routelist.forEach(function(route){
		gulp.src(route.js)
		.pipe(concat(route.path+".js"))
		.pipe(gulp.dest(path.jsDist));
	});

});
// 3、合并css
gulp.task('concatCSS',function(){
	return routeList.routelist.forEach(function(route){
		gulp.src(route.css)
		.pipe(concat(route.path+".css"))
		.pipe(gulp.dest(path.cssDist));
	});
});



// http 服务
gulp.task('connect',function(){
	connect.server({
		port:"8233",
		liveload:true
	})
});

// 监控变化
gulp.task('watch',function(){
	var _jses = [path.jsCore,path.jsTool,path.pagelet+'/js/*.js',path.jsStart];
	gulp.watch(["./src/**/*.html","./src/**/*.tpl"],["reloadHTML"]);
	gulp.watch(_jses,['reloadJS']);
	gulp.watch(['./src/**/*.css'],['reloadCSS']);
	gulp.watch(['./config/*.*'],['reloadHTML','reloadJS','reloadCSS']);
});


// 清除 HTML
gulp.task('cleanHTML',function (done) {
	return gulp.src(path.htmlDist+'/*.html',{
		read:false
	})
	.pipe(clean({force:true}));
});

// 清除JS
gulp.task('cleanJS',function(){
	return gulp.src(path.jsDist+"*.js",{
		read:false
	})
	.pipe(clean({force:true}));
});

// 清除CSS
gulp.task('cleanCSS',function(){
	return gulp.src(path.cssDist+"*.css",{
		read:false
	})
	.pipe(clean({force:true}));
})


// 重新加载HTML
gulp.task('reloadHTML',function(cb){
	sequence('cleanHTML','concatHTML',cb);
});
// 重新加载JS
gulp.task('reloadJS',function(cb){
	sequence('cleanJS','concatJS',cb);
});
// 重新加载CSS
gulp.task('reloadCSS',function(cb){
	sequence('cleanCSS','concatCSS',cb);
});


gulp.task('default',function(cb){
	console.log("start....");
	sequence('cleanHTML','cleanJS','cleanCSS','concatHTML','concatJS','concatCSS','connect','watch',cb);
});
