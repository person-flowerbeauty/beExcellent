(function(modules) { // webpackBootstrap
	// The module cache 先定义一个缓存，一个模块加载完了不需要重复加载
	var installedModules = {};
	// The require function 实现了一个require方法，因为require不能在浏览器执行。
	function __webpack_require__(moduleId) {
		// Check if module is in cache 检查是否在缓存中
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false, // 是否加载完成
			exports: {}
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// Return the exports of the module
		return module.exports;
	}
	// Load entry module and return exports 向自实现的require方法中传入入口文件
	return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({
  "./src/index.js": (function(module, exports, __webpack_require__) {
    eval("let str = __webpack_require__(\"./src/one.js\");\n\nconsole.log(str);");
  }),
  "./src/one.js":  (function(module, exports) {
    eval("module.exports = 'cyy';\n\n//# sourceURL=webpack:///./src/one.js?");
  })
});