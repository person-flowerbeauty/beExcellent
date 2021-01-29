let path = require('path'); // 需要node的核心模块path，要求是绝对路径,path.resolve就是把相对路径解析为绝对路径,__dirname是在当前目录下生成dist文件。
/**
 * 由于path.resolve是解析绝对路径的，所以如果‘/temp’就是绝对路径的/temp不会与之前的拼接
 * __dirname: 当前文件所在目录的绝对路径；__filename：当前文件带有文件名的绝对路径; process.cwd()：获得当前执行node命令时候的文件夹目录
 */
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimazeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let UglifyjsPlugin = require('uglifyjs-webpack-plugin');
let TerserPlugin = require('terser-webpack-plugin');
let Webpack = require('webpack');
let {CleanWebpackPlugin} = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devServer: { // 开发服务器配置
        progress: true, // 打包时候的动作条
        contentBase: path.resolve(__dirname), // 选择哪个文件作为静态服务
        open: true, // 自动打开浏览器
        compress: true, // 启动gzp压缩
        index: 'index.html'
    },
    mode: 'development', // 默认两种，production、development
    entry: './src/hooks/effect.js', // 打包入口，可以为相对路径
    output: { // 打包后。出口。统一的打包的配置，所有文件都生效。
        filename: 'bundle.[hash:8].js', // 打包后的文件名,只显示8位的hash；多页面时[name].js代表根据入口文件对应属性名生成对应的出口文件名
        path: path.resolve(__dirname, 'build'), // 把打包后的文件放在哪
        // publicPath: 
    },
    devtool: 'source-map', // 增加打包压缩后的映射文件，方便调试源代码
    watch: true, // 开启实时打包
    watchOptions: {
        poll: 1000, // webpack在1s内监测代码多少次
        aggregateTimeout: 500, // 防抖，在连续输入终止500ms后再重新打包
        ignored: /node_nodules/ // 忽略哪些文件
    },
    plugins: [ // 数组，放着所有的webpack插件.顺序没有先后
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模版html的路径
            filename: 'index.html', // 打包后对应的文件名
            // minify: { // 对打包后或打包到内存中的html进行一些压缩操作
            //     removeAttributeQuotes: true, // 去除属性双引号
            //     collapseWhitespace: true, // 折成一行
            // },
            // hash: true, // 在引用的打包后的脚本后(引用的js或css)增加哈希值，来解决缓存问题.或者在出口文件明中间增加hash来防止一些意外缓存的问题
            // chunks: ['index'], // 多入口时，该html引用的js的文件名
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css', // 打包后路径中的css文件名称
        }),
        new Webpack.ProvidePlugin({$: 'jquery'}),
        new CleanWebpackPlugin(), // 要清空的文件夹，可以为多个，用数组存放
        new CopyWebpackPlugin({patterns: [{from: './public', to: './'}]})// from最好是相对路径，绝对路径使用path.resolve，to默认是打包后的文件夹，相对路径也是相对于打包后的文件夹。
    ],
    module: { // 模块，会包含很多文件，比如js、css等。所以要用正则匹配你所要使用的
        rules: [ // 具体n多模块规则
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 200 * 1024, // 不符合时会自己调用file-loader， 符合会生成base64存储。
                            esModule: false,
                            // outputPath: 'img/'
                        }
                    }
                ]
            },
            // {
            //     test: /\.(png|jpg|gif)$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 esModule: false
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.css$/, // 正则匹配
                use: [{
                    loader: 'style-loader',
                    options: { // 还可以传递一些其它属性
                        insert: 'head' // 把style插入到手写的<style>上面, 与视频对应inserAt不对
                    }
                }, 'css-loader'], // 使用的loader，css-loader:主要解决css文件中使用@import引用其他css; style-loader: 把css放入style标签插入到head的标签中。
            },
            {
                test: /\.less$/, // 正则匹配
                use: [
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insert: 'top'
                    //     }
                    // }, 
                    MiniCssExtractPlugin.loader, // 使用link标签引入main.css文件，与上面配置的插件名字相同。可以多个对应同一个文件，也可以引入多个插件生成多个css文件。
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ], // less-loader把less文件解析成css文件并再通过css-loader和style-loader插入到页面
            },
            {
                test: /\.js$/, // 尽量使用test和include来来匹配必须文件而不是用exclude。exclude先于他俩执行
                use: [
                    {
                        loader: 'babel-loader', // 是一个集合加载器，可以放很多小插件
                        options: {
                            presets: [ // 也是一个plugins的集合，把很多需要转换的es6语法插件集合在一起
                                ['@babel/preset-env'], // 最常用的presets，包含了大部分能够转换的es6语法，如未包含打包时就会报错，再在plugins里补充
                                ['babel-preset-react-app'] // github上查一下，这个包内置包含了很多包，像上面@babel/preset-env就不需要引入了
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                ['@babel/plugin-transform-runtime']
                            ]
                        }
                    },
                    // {
                    //     loader: 'eslint-loader', // 需要在根目录配置.eslint.js的eslint配置文件
                    //     options: {
                    //         enforce: 'pre' // 强制提前执行，previous\post代表之前、之后.因为校验要在编译前进行，所以当eslint-loader写在babel-loader后面时，使用pre强制提前
                    //     }
                    // }
                    // {
                    //     test: require.resolve('jquery'), // 项目中引用了jquery就匹配
                    //     use: 'expose-loader?$'
                    // }
                ],
                include: [path.resolve(__dirname, 'src')],
                exclude: [path.resolve(__dirname, 'node_modules')] // test、exclude、include是匹配条件，可以是正则或者字符串集合。include和exclude尽量使用绝对路径数组。
            }
        ]
    },
    optimization: { // 优化项
        minimizer: [ // 优化器
            new OptimazeCssAssetsPlugin(),
            // new UglifyjsPlugin({
            //     cache: true, // 缓存
            //     parallel: true, // 并发打包
            //     sourceMap: true // 压缩完后有个源码映射方便调试（比如es6转成es5）
            // }),
            // new TerserPlugin()
        ]
    }
}