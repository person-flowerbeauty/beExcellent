// 测试自己封装的promise时回调用此方法
// module.defer = Promise.deferred = function () {
//     let dfd = {};
//     dfd.promise = new Promise(() => {
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     });
//     return dfd;
// }

/* start 待解决，为什么node和浏览器执行顺序不一样 */
async function async1() {
    console.log("async1 start"); // 2
    await async2();
    console.log("async1 end"); // 6
}

async function async2() {
    console.log("async2"); // 3
}

console.log("script start"); // 1

setTimeout(function () {
    console.log("setTimeout"); //8
}, 0);

async1();

new Promise(function (resolve) {
    console.log("promise1"); // 4
    resolve();
}).then(function () {
    console.log("promise2"); // 7
});
console.log('script end') // 5
/* end */

/* start p1为链式调用最后一项的返回值 */
const p1 = new Promise((resolve) => {
    setTimeout(() => {
        resolve('resolve3');
        console.log('timer1') // 3
    }, 0)
    resolve('resovle1');
    resolve('resolve2');
}).then(res => {
    console.log(res) // 1 - resovle1
    setTimeout(() => {
        console.log(p1) // 4 - resovle1
    }, 1000)
}).finally(res => {
    console.log('finally', res) // 2 - undefined
})
/* end */

/**
 * 迭代和异步迭代（step）
 * 根文件结构处理
 * 栈形数据结构处理
 * run queue
 */

 /* start 使用Promsie实现每隔1s输出1，2，3 */
function outPutAsync (arr = [1, 2, 3], time = 1000) {
    function step (arr) {
        if (arr.length) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(arr[0]);
                    resolve(arr.shift());
                }, time);
            }).then(() => step(arr));
        }
    };
    step(arr);
};
outPutAsync();

[1, 2, 3].reduce((accu, current) => {
    return accu.then(() => {
        return new Promise(resolve => setTimeout(() => resolve(console.log(current)), 1000));
    });
}, Promise.resolve())
/* end */

/* promise.allSettel */
Promise.allSettel = function (iterValue) {
    return new Promise((resolve, reject) => {
        if (iterValue[Symbol.iterator]) {
            for (let value of iterValue) {
                if (value && value.then && typeof value.then === 'function') {
                    
                } else {
                    
                }
            }
        } else {
            throw 'wawawawawa'
        }
    });
};
Promise.allSettel([1, 2]);
