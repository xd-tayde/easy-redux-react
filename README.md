## Easy-Redux-React

该插件封装了 react-redux 的 api, 集中化管理 store, action 与 reducer, 简化了使用,极小的接入成本和最简单的使用方式，即插即用。

### Usage

```js
import EasyReduxReact from 'easy-redux-react'
import ReactDOM from 'react-dom'

// redux-store
const _ins = new EasyReduxReact({
	reduxConfig: {
	    // key
	    list: {
	        // initState
	        initValue: [],
	        // actions map
	        actions: {
	            // action name: reducer
	            ADD_LIST: (state, data) => state.concat(data.payload),
               	REMOVE_LIST: (state, data) => {
                    const _list = [...state]
                    _list.splice(data.payload, 1)
                    return _list
               },	        
           },
	    },
	},
})

const App = () => {
	// 可以直接使用连接后的 state 与 action
	const { list, addList, removeList } = props

	return (
		 <div id="App">easy-redux-react</div>
	)
}

const ReduxApp = _ins.connectTo(App)
const Provider = _ins.getProvider()
 
ReactDOM.render(
	<Provider>
        <ReduxApp />
    </Provider>,
	mountNode,
)
```

#### 1. 初始化实例

```js
new EasyReduxReact({
    // redux config include state - action - reducer
    reduxConfig: {
    	[stateKey: string]: {
	        initValue: any,
	        actions: {
	            [reducerName: string]: (state: any, data: { payload: number, type: string }) => any,
	        },
	    }
    }
    
    // use it to init store with the ssr pre-fetch data
    hydrateData?: object
    
    // check the async reducer res, if true, will trigger the success action
    checkRes?: (res: any) => boolean
    
    // handle the async reducer res
    handleRes?: (res: any) => any
})
```

#### 1. reduxConfig

redux 的核心配置，包含 state - action - reducer，例如：

```js
const reduxConfig = {
	// 存储于 store 中的 key 值
	userInfo: {
		// 该值的初始化状态
		initValue: null,
		// 与该值关联的所有 action
		actions: {
			// action name:  reducer
			// 触发 action 时传入的数据固定保存在 data.payload 中
			// data = { type: 'SET_USER_INFO', payload: {} }
			// state 为该数据原先的值
			SET_USER_INFO: (state, data) => data.payload,
			
			// 清空 userInfo 
			EMPTY_USER_INFO: () => null,
		}
	}
}
```

### 连接组件

```js
// 连接用户信息
_ins.connectTo(Component, stateKeys?: string[], dispatchMap?: object)
```

#### 1. stateKeys

该组件中需要注入的 state key，例如:

```js
// store 为 { a: 1, b: 2 }
// A组件中只需要引入数据a， 则:

const stateKeys = ['a']
_ins.connectTo(ComponentA, stateKeys)

```

**不传该值时，默认将 store 中所有数据均注入到组件中 **

#### 2. dispatchMap

连接后，组件中 props 上的方法与 action 的映射关系，例如：

```js

interface IDispatchMap {
    [actionName: string]: string | {
        fetch: (...params: any) => Promise<any>,
        success: string,
        error?: string,
    }
}

const dispatchMap: IDispatchMap = {
	// 异步触发
	setUserInfo: {
		// 通过执行该异步函数获取 userInfo
		// 该方法必须返回一个 promise
		fetch: getUserInfoWithAjax,
		// 获取成功时，触发成功 Action
		success: 'SET_USER_INFO',
		// 获取失败时，触发错误的 Action
		error: 'FETCH_ERROR',
	},
	// 同步触发
	emptyUserInfo: 'EMPTY_USER_INFO',
}
```

**不传该值时，默认将连接的数据的所有 action 注入 props 中，方法名为驼峰的形式，例如: SET_USER_INFO ---> props.setUserInfo **

#### 3. 使用

连接后，即可以直接在 Component 中进行使用

```js
// 在 Component 中即可以使用 
// 获取全局 store 中的属性
props.userInfo

// 同时自行添加了对应的 dispatch 方法
// 方法名: Action 名字转成 驼峰
// eg. SET_USER_INFO
props.setUserInfo()

// 如果是异步
// 调用
props.setUserInfo(xxx).then((data) => {
    // 异步请求成功: data
    // 会自动触发 action 并存储到 redux-store 中
}).catch(err => {
    // 捕获请求失败
})
```

### 暴露原生 API，可任意地方自行引用后调用

```js
const { dispatch, getState, subscribe } = _ins.getStore()

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

