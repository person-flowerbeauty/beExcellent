const fs = require('fs');
const path = require('path');

const Promise = require('./promise');

// 不用插件时，路径是相对于当前的根目录的。所以使用path.resolve来获取当前的绝对路径
// fs.readFile(path.resolve(__dirname, './test.txt'), 'utf-8', (err, data) => {
//     console.log(err, data);
// });

// const fs = require('fs').promises;
// const txt = fs.readFile(path.resolve(__dirname, './test.txt'), 'utf-8').then(data => console.log(data));

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    })
});
p1.then(data => console.log(data));

// 类数组：有索引、有长度、能遍历
// generator生成器，生成迭代器iterator，具有next方法，并且每次返回{value: , done}
// 使用一次next方法，会执行一个yield。如果let content = yield 2;再第二次next时才会执行把上一次的返回结果赋值给content，并且执行到下一个yield
// co + generator 及语法糖  async + await

// js的主线程是单线程的
// 计算机在调度任务时是以进程为单位的
// 浏览器的主界面就是它的主进程，每个页卡也是单独的进程，网络请求也是进程，等等。
// 每个页卡都有渲染进程（浏览器内核提供）
// 渲染进程包括很多线程。-ui渲染线程；-js线程（v8引擎）；-每一个单独的事件，单独的定时器，单独的ajax都是一个单独的线程；-调度线程（eventLoop）
// 宏任务（宿主环境提供的异步方法）；微任务（语言标准提供的。Promise的then或者h5语言环境提供的mutationObserver）