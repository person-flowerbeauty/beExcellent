## webpack 安装
- 安装本地webpack，防止全局版本不一致
- 学习4.0所以安装webpack webpack-cli -D开发依赖，上线时候不需要打包
- 步骤：
    - 初始化 yarn init -y
    - yarn add webpack webpack-cli -D
- 任何一个增强或者转化功能都需要用对应的loader，相当于功能的一个包装，使用包装才能在webpack中正常识别执行
- 常见文件夹释义：bin，可执行文件；lib，该工程用到的库
## webpack可以进行0配置，但是功能比较弱
- 打包工具，把源码打包成输出后的结果（识别js模块），从入口把js打包
- npx webpack -> node_moudules里的webpack下的bin中的webpack.js又依赖了webpack.cli
- 支持js的模块化.可以使用CommonJs规范使用module等，但是node模式支持，浏览器不支持
- 未配置前默认打包为生产环境'production',尽量压缩格式化小巧等功能。可以配置切换为'development'来方便查看打包前结果
- 打包后可以让浏览器识别module等语法规范。
## 手动配置webpack 
- 默认配置文件的名字 webpack.config.js，也可以通过打包时执行npx webpack --config xxx来自定义打包时使用的配置文件名，一般在pakage.json里配置一些执行脚本
- scripts: {
    build: "webpack --config xxx" 会自动去node_modules里去找webpack里的bin文件执行，使用npm run build执行。
}
- webpack是node写出来的，所以配置文件默认要node写法
- development打包后整体是一个匿名函数自执行，参数是一个对象，属性名为模块（文件）相对路径，值是一个函数.
- 本质就是把入口模块及依赖模块转变成一个对象，然后使用内部封装的递归方法，通过入口执行。
## 本地开发服务(ip地址访问)
- 内置开发服务通过express实现
- yarn add webpack-dev-server -D
- 运行 npx webpack-dev-server,以当前目录下作为静态目录，进入一个文件夹点选页面
- 配置devServer。修改代码时可以根据配置文件自动打包，并刷新浏览器，但是只有修改入口文件及其引用文件是才自动刷新
- index不指定访问资源时，默认index.html，可以通过改变index改变默认文件访问. ps: 启动后的服务地址，可以访问到2中资源，一是通过webpack-dev-server打包并存放在内存中的html文件，也就是webpack output is serverd from路径下的（受devServer配置中的publicPath或者output里的publicPath影响），这里默认打开的就是，所以index属性针对的是打包后的文件。二是基于当前路径（也就是contentBase所标注的路径）下能访问到的静态资源，这个静态资源并不受index属性的影响。
- 但是这样，在本地启动服务还是要先在本地打包build目录，然后再npx webpack-dev-server启动服务。应该是直接启动服务能够自己建一个html打包到内存中
- 自己在src建立html，希望把打包的结果自动加载到html中，并且把html输出到配置文件出口的路径上,并且打开出口路径上的html
## 插件
- 配置plugins
- 使用html-webpack-plugin插件，使html自动插入脚本并输出到出口文件中。配置后无需devServer来规定contentBase
- webpack就是通过插件堆叠起来的。插件都是类
## 解析css模块
- 不能在html中引用css，因为html作为模版会原封不动放入打包文件，但是入口文件没有css，不会把css跟着打包到打包文件。
- 希望把css文件作为模块引入入口js文件。但是css本身不能作为一个模块被引用，即直接食用require引用css在打包时候会报错。
- 需要使用loader把原css转化成一个模块
- 单个loader也有但一原则，只用一个loader时可以写为字符串，多个时候为数组。但是loader也是有顺序的，从右到左，所以css-loader在右，style-loader在左。还可以写为对象的格式
- 打包后样式插入head标签，默认在模版内手写的<style>标签后面
## 抽离css样式文件
- 上面的css都是打包后通过style标签插入到html中的。如果希望打包成单独的css文件再通过link标签引入。
- yarn add mini-css-extract-plugin -D,基于webpack4.0才有的
- 使用后不会默认压缩打包后的css，需要自己压缩。使用webpack4新提供的优化项属性，来压缩
## 自动给样式增加浏览器前缀
- yarn add postcss-loader autoprefixer,自动添加css前缀，需要使用loader去添加。在解析为css之前使用
- 单纯使用loader会报错，提示要对PostCss进行配置：postcss.config.js,使用loader时会自动调用这个配置文件,里面引用autoprefixer插件来实现功能。
- 配置文件中单独写require('autoprefixer')未能成功添加前缀，需要设置生效的浏览器。在package.json中 https://juejin.im/post/5b8cff326fb9a019fd1474d6 网站：browserl.ist。打包工具都会根据这个属性来打包需要支持的浏览器版本。
- 部分属性增加-webkit-前缀
## 压缩打包css
- js是在选择production模式时就会尽量压缩打包。html在html-webpack-plugin插件中有参数控制，minify.
- 使用optimize-css-assets-webpack-plugin插件来压缩css。但是设置optimization.minimizer属性会覆盖webpack默认的js压缩设置，所以还要额外配置js压缩器
- js压缩器，terser-webpack-plugin或者uglifyjs-webpack-plugin(后者不支持es6，需要在压缩之前，把文件使用babel-loader处理)，因为是负责压缩的，如果是development模式，不涉及压缩就不会报错
## 处理js模块
- 高级语法转成es5，使用babel转化js
- babel-loader模块化转换输出（转换的桥梁），@babel/core核心模块转化源代码， @babel/preset-env使es6转换成es5
- class A {a = 1} 是es7的语法，使用会报错。要用@babel/plugin-proposal-class-properties.同样也使用babel-loader实现功能
## 高级js方法的转化
- 虽然es6转化为es5了，但是只是语法层面的转化，并不能解析一些API，比如Generator函数，Promise函数
- babel把js分为syntax和api。
- syntax：新的语法。比如let const class，我们使用js无法重写的东西，对之前语法锦上添花的东西。
- api：一些新的暴露在全局或实例上的方法，我们能自己使用js重新覆盖，
- 所以babel只是负责了转换syntax层面的。而API层面需要我们使用@babel/ployfill.它是把没有的API自己写了函数来进行兼容，随着浏览器的改动会有很大不同，所以会造成ployfill包很大。所以需要用到按需加载来减小打包后的体积，在babel/preset-env插件中有个属性就支持，useBuiltIns：false、entry、usage，不引入ployfill，全部引入ployfill的方法，按使用引入方法；还有个targets属性，是用来控制要支持哪些浏览器版本，已经在browserlist属性里支持。
- babel只是转化syntax层的语法，一些API需要依赖@babel/ployfill来兼容（提供所有新类跟新方法），但是由于ployfill体积太大而且污染全局，所以使用preset中的属性useBuiltIns来控制加载或按需加载。后续为了兼容本地组件开发和库的组件（由于全局API名字重复导致的问题）使用@babel/runtime来隔离（库中的Promise拷贝到_Promise中，实现与外界隔离，并提供帮助函数实现新功能）
- @babel/runtime提供所有需要用到的帮助函数，@babel/plugin-transform-runtime是把所有需要helper函数的文件依赖上@babel/runtime包（线上也需要）并创建沙盒环境
- 帮助函数是babel转译时生成的不一定是ployfill的，可能是syntas转译，每个新语法都转译一次所以会有很多重复。解决全局污染是针对ployfill的。所以runtime针对syntax和API都有优化。只是提供帮助函数，但是不能把新语法转换成帮助函数所以需要babel编译；只是提供了部分新方法的实现，不能提供实例方法比如includes的实现，所以也不能代替ployfill（在corejs3中可以替代实现）；
- @babel/plugin-transform-runtime @babel/runtime.不设置属性时默认所有API方法均由用户提供，或者设置corejs来指定由包提供.需要安装@babel/runtime-corejs
## 校验js
- eslint: https://cn.eslint.org/ eslint 和 eslint-loader
- 在编译js之前校验。在官网下载.eslint.js文件就可以
## 第三方模块使用
- 比如jquery。可以在代码中引用，import $ from 'jquery'；但是$并不是挂在window上的，可能跟编译时解析为一个闭包函数有关；
- pre为前面执行的loader、post为后面执行的loader、normal为普通loader、expose-loader是一个内联loader：可以直接在代码里使用的loader
- import $ from 'expose-loader?$!jquery'; ?$代表向外暴露一个$符号，！jquery代表向外暴露的时jquery。类似传参的意思
- 第一步优化就是移入到webpack配置中，这一步还是需要在使用文件中import $ from 'jquery'
- 最终优化希望不用手动引入就可以获取到$.但是这个方法不会把$挂载到window上1
- 使用webpack插件。webpack.ProvidePlugin({$: 'jquery'})在每个模块中都提供$.但不能使用window.$
- 上面方法都是把jquery作为模块引入的。如果是在html中使用script标签引入cdn的方式引入jquery（快），直接在window上就有$
- webpack的externals属性表示有些模块不需要被打包（比如第三方模块使用cdn的方式被引入，但是项目中又写了import）
## 打包图片
- 图片引入：1、js中创建图片并引入。2、在css中使用background引入 3、在html中写<img />标签
- 1、let image = new Image(); image.src = './yy.png'; document.body.appendChild(image);这样并不会触发webpack打包图片，打包后build文件夹中并没有图片，所以导致图片引用不到.因为会把'yy.png'解析为字符串，并没有触发打包。所以如果使用require引用图片则会让webpack把图片识别成一个模块触发打包。使用file-loader 默认会在内部生成一张图片，放到build目录下，并且把生成图片的名字返回回来,功能就是把任何方式引用的图片打包时候生成一个新图片放入build文件。所以感觉任何有关图片的loader或这plugin可能都依赖它
- 2、在css文件中通过url(./yy.png)是支持的，因为配置过css-loader，所以在编译时就会解析为url(require('./yy.png'))，所以如果在js中写css，也要使用require的方式。
- 3、在html中写的img的src如果需要正确引入图片则需要loader。html-withimg-loader
- 上面引用图片是使用http请求去引用的，如果有时图片比较小，希望用base64代表图片的时候。
- 一般用图片时不实用file-loader，一般使用url-loader，可以限制图片小于多少时，使用base64，大于的时候使用file-loader输出
## 静态文件分类
- 图片文件，增加属性outputPath：'img/' 或者 '/img/'就是会打包到build文件下的img文件夹下，上面三种获取图片方式会自动引用新路径不用该，因为file-loader输出的就是新路径
- css文件是通过MiniCssExtractPlugin生成并放入build文件的，可以直接在参数的文件名前面加上路径，就可以输出为路径文件
- 涉及到输出文件名的地方，在文件名前加路径应该会自动识别生成文件夹
- 出口的output里的属性publicPath，就是在引用资源的时候统一加一个这路径。单独在某个插件或者loader里增加publicPath参数。
## 多入口
- entry改写为对象，每个属性对应一个入口文件。ouput出口文件也需要多个，filename就改写为[name].js形式，打包后对应的文件名就是入口中的属性名
- 多页面对应多个html。html-webpack-plugin插件会根据模版html自动打包并把入口文件引入新的html文件，而对应多个入口时，就需要new多次该插件，但是每一次都还是会收纳所有的入口js文件。所以使用插件内属性，chunks：[入口文件名]；
## sourceMap
- 打包编译js过程中，会把高级语法编译成低级语法。打包压缩后，代码变为不可读的，如果控制台有报错，点过去以后依旧是压缩后的代码。所以需要源码映射，增加映射文件，帮助调试代码。
- webpack的devtool属性。devtool: 'source-map'，源码映射会单独生成一个sourcemap文件，出错后会标识当前出错的列和行。映射前的报错信息显示的是打包后文件的出错位置，因为被压缩所以对应不上，映射后的报错信息是显示的打包前的文件位置，并且在浏览器source里会有个webpack栏，就是映射文件。这种配置大，全
- devtool：'eval-source-map'不会产生单独的文件，会把映射代码放入打包后的js文件中
- devtool: 'cheap-moudle-source-map'不会产生列，但是是一个单独的映射文件，会指示报错的行但是不会提示具体报错内容；对应‘cheap-moudle-eval-source-map’
## 实时监控打包文件
- 非热更新。而是，边改能边打包。如果本地起着服务，也能实现实时改变。
- watch: true.
- watchOptions: {}
    - poll:1000;1s中webpack会监测代码多少次，越高越准确但是消耗性能。
    - aggregateTimeout: 500; 防抖，在停止输入多少秒后再进行监测
    - ignored: /node_modules/;
## 一些小插件
- yarn add clean-webpack-plugin -D;使用：new CleanWebpackPlugin('./build);再次打包之前先删除build文件夹下内容。场景：比如你再次打包时，只更新了打包后的html文件名，但是会发现build文件中存在上次打包的html并未删除。
- yarn add copy-webpack-plugin -D;使用：new CopyWebpackPlugin({from: '', to: ''});场景：打包时想把一些未被入口文件引用的文件或文件夹一同打包。只会在production模式下工作。

更改内容，保存就会出发服务刷新并更新内容是哪一步做到的。安装webpack-dev-server后？
多个style标签造成的阻塞
inserAt、transform
browserslist属性指定浏览器
runtime和ployfill实践感觉是一样的。没有指定corejs也没有感觉有影响。如果在自模块里使用新API会报出一个exports的错误
require.resolve