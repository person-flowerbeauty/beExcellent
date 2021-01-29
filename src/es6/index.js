const proxy = new Proxy(function(a, b) {
    return a + b;
}, {
    apply: function(target, thisbinding, args) {
        return args[0]; // 函数执行时被调用
    },
    construct: function(target, args) {
        return {value: args[1]}; // 需要返回一个对象
    }
});
console.log(proxy(1, 2));
console.log(new proxy(1, 2));

/**
 * Proxy相当于访问某个对象前增加了一层拦截层；
 * obj.a = 1,相当于setter；obj.a.b = 1相当于先getter a再setter b
 * Object.getOwnPropertyNames()方法返回该对象自身属性的属性名；而for in和 Object.keys()方法返回的是可枚举属性
 * Object.preventExtensions(obj)把一个obj对象变为不可扩展的即不能添加新的属性
 * 拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效
 */

 // 数组的负索引
const createArray = (...args) => {
    const handler = {
        get(target, propKey, receiver) {
            if (propKey < 0) {
                propKey = String(target.length + Number(propKey));
            }
            return Reflect.get(target, propKey, receiver);
        }
    };
    return new Proxy(args, handler);
};
console.log(createArray(1, 2, 3, 4)[-2]);

// 分解参数
function originFunc(a, b, c, d) {
    return a + b + c + d;
};
const curryFunc = (func, ...args) => {
    const length = func.length;
    if (args.length >= length) {
        return func(...args);
    } else {
        return (...innerArgs) => {
            return curryFunc.apply(this, [func, ...args, ...innerArgs]);
        };
    }
};
const testCurry = curryFunc(originFunc);
console.log(testCurry(1)(2)(3, 4));
console.log(curryFunc(originFunc, 1, 2, 3, 4));

// receiver参数表示原始读操作所在的对象。谁要读

// Reflect对象是封装了部分Object对象的方法，使一些方法更像是函数调用。当前和Proxy有相同的方法，即代理层的方法都会通过Reflect内部方法实现。