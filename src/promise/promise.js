const STATUS_ENUM = {
    PENDING: 'pendding',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

/**
 * 处理then返回的p2与参数函数返回值的关系
 */
const comparePromise = (x, p2, resolve, reject) => {
    if (x === p2) { // 不能自己等自己。类型错误。
        throw new Error('TypeError');
    };
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {// 判断是否返回的是一个Promise
        try { // 捕获x.then是否会报错，因为可能有数据劫持
            let thenable = x.then;
            if (thenable && typeof thenable === 'function') { // 要有then属性并且是个函数
                /**
                 * 下面这个方法调用不写成x.then（）是因为不重复获取then属性，避免一些意外（数据劫持）
                 * 要使用call把this绑定回x，因为then方法里会使用到this.value。
                 * 下面写的涉及到了一个递归。其实简单来写直接thenable.call(x, resolve, reject)，因为resolve方法里封装了参数为promise实例的处理，这里使用递归
                 * 主要是会有各个版本的符合promiseA+规范的自定义Promise，而我们resolve方法封装时使用的instanceof方法判断的，这样只能判断自己封装的promise实例，如果真的接受到别人的promise实例
                 * 是无法判断的，所以使用递归处理了。
                 */
                thenable.call(x, y => {
                    comparePromise(y, p2, resolve, reject);
                }, r => {
                    reject(r);
                });
            } else {
                resolve(x);
            }
        } catch (err) {
            reject(err);
        }
    } else {
        resolve(x);
    };
};

class Promise {
    static resolve(value) {
        return new Promise((resolve, reject) => {
            resolve(value);
        });
    }
    static reject(err) {
        return new Promise((resolve, reject) => {
            reject(err);
        });
    }
    constructor(executor) {
        const resolve = (value) => { // 因为无论在原型还是实例自身属性上都拿不到内置的resolve和reject，所以是内部变量
            if (this.status !== STATUS_ENUM.PENDING) return; // promise的状态只能够改变一次；
            if (value instanceof Promise) return value.then(resolve, reject); // 如果resolve传入的是一个promise则需要等待这个promise状态
            this.status = STATUS_ENUM.FULFILLED;
            this.value = value;
            this.resolves.forEach(item => item()); // 发布的过程
        };
        const reject = (reason) => {
            if (this.status !== STATUS_ENUM.PENDING) return;
            this.status = STATUS_ENUM.REJECTED;
            this.value = reason;
            this.rejects.forEach(item => item());
        };
        this.status = STATUS_ENUM.PENDING;
        this.resolves = [];
        this.rejects = [];
        try {
            executor(resolve, reject);
        } catch(error) {
            reject(error);
        }
    };
    then(onFulfilled, onRejected) { // 当状态异步改变时，是订阅的过程
        /**
         * then方法调用时不是每次都会传入onFulfilled和onRejected
         * 并且错误具有穿透性，直到被捕获
         */
        onFulfilled = onFulfilled || (y => y);
        onRejected = onRejected || (r => {throw r});

        let p2 = new Promise((resolve, reject) => { // then方法的链式调用是因为每次then都返回一个新的promise
            if (this.status === STATUS_ENUM.PENDING) {
                this.resolves.push(() => {
                    setTimeout(() => { // then方法执行时是异步的，这里开个定时器。
                        try { // 参数函数执行时报错则应该reject。不能写在setTimeout外面，捕获不到错误。
                            let x = onFulfilled(this.value);
                            // 判断x和p2的关系
                            comparePromise(x, p2, resolve, reject); // 因为上面异步定时器，这里才能拿到p2，否则在new Promise内部执行时不能拿到返回值
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
                this.rejects.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.value);
                            comparePromise(x, p2, resolve, reject);
                        } catch (err) {
                            reject(err)
                        }
                    });
                });
            };
            if (this.status === STATUS_ENUM.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        comparePromise(x, p2, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                });
            };
            if (this.value === STATUS_ENUM.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.value);
                        comparePromise(x, p2, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                });
            }
        });
        return p2;
    };
    catch(onFulfilled) { // 只有捕获错误的能力，相当于没有处理成功状态的then
        return this.then(null, onFulfilled);
    };
    finally(func) {
        // 无论成功失败都会被调用，不影响链式调用，func正常执行不影响后面链式调用的，如果报错则后面promise状态变为reject
        // func可以返回promise实例，实例如果成功状态并不影响后面promise实例取值（取之前实例的），如果失败状态，则把当前失败原因传入下个promise实例
        return this.then(value => {
            return Promise.resolve(func()).then(() => value);
        }, err => {
            return Promise.resolve(func()).then(() => {throw err});
        });
    };
    all(array) {
        const result = [];
        let index = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < array.length; i ++) {
                const current = array[i];
                if(current instanceof Promise) {
                    current.then(value => {
                        result[i] = value;
                        index ++;
                        if (++index === result.length) resolve(result);
                    }, err => {
                        reject(err);
                        break;
                    });
                } else {
                    result[i] = current;
                    if (++index === result.length) resolve(result);
                }
            }
        });
    };
    race(array) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < array.length; i++) {
                const current = array[i];
                if(current instanceof Promise) {
                    current.then(value => {
                        resolve(value);
                        break;
                    }, err => {
                        reject(err);
                        break;
                    });
                } else {
                    resolve(current);
                }
            }
        });
    };
};

module.exports = Promise;