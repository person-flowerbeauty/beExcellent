const queue = [];

// 第一个任务
const beforeEach = ((from, to, next) => {
    // 一些判断逻判断是否要执行next方法
    setTimeout(() => {
        next(); // 用户手动控制逻辑通过就进行下一个任务
    }, 1000);
});
// 第二个任务
const beforeEach = (() => {
    setTimeout(() => {
        next(); // 用户手动控制逻辑通过就进行下一个任务
    }, 1000);
});

// 收集任务，订阅
function beforeEach (fn) {
    queue.push(fn)
};

/**
 * 等到特殊时刻（比如1切换路由）发布任务
 * @param {Array} queue 待执行的任务队列
 * @param {function iterator(from, to, next) {
    根据实际情况写参数
 }} iterator 执行每个任务的函数
 * @param {Function} cb 任务队列执行完毕后继续执行前被隔断的主任务
 */
function runQueue (queue, iterator, cb) {
    // 逐步执行，异步迭代
    function step (index) {
        // 每一个要执行的任务
        const hook = queue[index];
        iterator(hook, () => step(++index));
    };
    step(0);
};

/**
 * 写在能够拿到任务所需参数的地方，触发任务
 * @param {Function} hook 用户传入的每个任务
 * @param {Function} next 用户手动调用next开启下一个任务
 */
function iterator(hook, next) {
    hook(1, 2, () => {
        // 方便扩展
        next();
    });
};