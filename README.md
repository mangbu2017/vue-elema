# app

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 两种加减控制器的互通原理
首先商品列表中的control(A)是依赖于goods组件中的data.goods
而购物车列表中的control(B)是依赖于从goods组件传入shopping组件的selectFoods
而selectFoods是依赖于data.goods的计算属性

他们的层级关系是
goods => shopping => B
         A
还有 如果传入的prop 是引用值 那么自组件会影响父组件

总结来说 他们都依赖于goods组件的data.goods