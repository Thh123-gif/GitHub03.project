const path=require('path');//加载path模块
module.exports={
    entry:'./js/index.js',//单入口
    output:{
        path:path.resolve(__dirname,'../dist/'),
        filename:'bundle.js'
    }
}