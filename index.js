/*
* 只适用于页面只引用了单个js文件，并且是字执行的
* 文件之间的依赖关系
* 处理方式将同步文件异步加载了
 */
var rScript = /<script([^>]*)><\/script>/ig;
var rSrcHref = /src=('|")(.+?)\1/i;

module.exports = function(ret, conf, settings, opt) {
    var files = ret.src;
    Object.keys(files).forEach(function(subpath) {
        var file = files[subpath];
        if (file.isHtmlLike) {
            var content = file.getContent();
            content = content.replace(rScript, function(all, script) {
                if (rSrcHref.test(script)) {
                    var src = RegExp.$2;
                    return '<script src="' + src + '" onerror="' + (settings.onerror || '') + '"></script>';
                }
                return all;
            });
            file.setContent(content);
        }
    });
};
