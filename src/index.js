// import $ from 'expose-loader?$!jquery';
// let str = 'cyy';
// require('./index.less');
// import logo from './yy.png'; // 把图片引入，返回一个新的图片地址，就是编译后放入build文件的新图片地址

// let fn = () => {
//     console.log('cc');
// }

// class A {
//     a = 1 // es7的语法
// }
// let cc = new A;
// console.log(str, fn, cc.a);
// console.log(Promise.resolve(2))

// function* c() {
//     yield 1;
// }
// console.log(c);

// console.log('str'.includes('s'), [].fill, Object.assign);
// console.log($)
// console.log(logo);
// let image = new Image();
// image.src = logo;
// document.body.appendChild(image);


/**
 * 2020-09-06 node第一天
 * 
 */
function sum(a, b, c, d, e) {
    return a + b + c + d + e
};
let newSum = currying(sum);
console.log(newSum(1)(2)(3)(4)(5));

function currying(func, ...args) {
    const len = func.length;
    return function (...innerArgs) {
        const paramsArr = args.concat(innerArgs);
        if (paramsArr.length === len) {
            return func(...paramsArr);
        } else {
            return currying(func, ...paramsArr);
        }
    }
}

console.log(Buffer.from([100]).toString());
