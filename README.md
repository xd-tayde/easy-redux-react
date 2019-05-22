## Easy-Redux-React

该插件封装了 react-redux 的 api, 集中化管理 store, action 与 reducer, 简化了使用，降低接入成本。

### Usage

#### 1. 初始化实例

- `new EasyReduxReact(options)`
    - 

```js
import EasyReduxReact from 'easy-redux-react'
// redux-store
const _ins = new EasyReduxReact({
    reduxConfig: {
        // key
        status: {
            // initState
            initValue: 'waiting',
            // actions map
            actions: {
                // action name: reducer
                SET__STATUS: (state, data) => data.payload,
            },
        },
    },
 })
```

### 全局注入 store
```js
import { StoreProvider } from '../app/store/index'

<StoreProvider>
    <Router>
        <App />
    </Router>
</StoreProvider>
```

### 连接组件

```js
import { connectTo, storeKey } from '../../../store/index'

// 连接用户信息
connectTo([storeKey.userInfo])(Login)

// 在 Login 中即可以使用 
// 获取全局 store 中的属性
props.userInfo

// 同时自行添加了对应的 dispatch 方法
// 方法名: Action 名字转成 驼峰
// eg. SET_USER_INFO
props.setUserInfo()
```

另外，也可自定义配置 dispatch 连接, 可直接包含异步操作

```js
const dispatchMap = {
    // 该方法名可任意自定义
    setCategoryFeedData: {
        // 异步后触发的 action
        success: 'SET_CATEGORY_FEED',
        // 可传入一个异步函数, 用于获取数据
        fetch: request.getCategoryData
    },
}
connectTo([storeKey.userInfo], dispatchMap)(Login)

// 调用
props.setCategoryFeedData(xxx).then((data) => {
    // 异步请求成功: data
    // 会自动触发 action 并存储到 redux-store 中
}).catch(err => {
    // 捕获请求失败
})
```

### 暴露原生 API，可任意地方自行引用后调用

```js
import { dispatch, getState, subscribe } from 'store'

// 手动触发
dispatch({
    type: 'SET_USER_INFO',
    payload: {
        name: 'dongdong'
    }
})

// 获取全局数据
getState()

// 订阅数据变化
subscribe(() => {
    // store 发生变化时触发
})
```

