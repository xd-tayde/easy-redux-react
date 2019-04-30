import { combineReducers, createStore, Reducer, Store } from 'redux'
import { connect } from 'react-redux'
import { handleActions, createAction } from 'redux-actions'
import { type } from '@Tools/index'

// 对象循环
const forin = (obj: object, fn: (value: any, key: string) => any) => {
    for (const k in obj) obj.hasOwnProperty(k) && fn(obj[k], k)
}

// 全大写下划线 转 驼峰
const toHump = (name: string) => name.toLowerCase().replace(/\_(\w)/g, (all, letter: string) => letter.toUpperCase())

interface IReduxConfig {
    [propsName: string] : {
        initValue: any,
        actions: {
            [propsName: string]: (state: any, data: any) => any
        }
    }
}

interface IUseHydrateData {
    elId: string
}

type ICheckRes = (res: any) => boolean
type IHandleRes= (res: any) => any

interface IPorps {
    reduxConfig: IReduxConfig
    useHydrateData?: IUseHydrateData
    checkRes?: ICheckRes
    handleRes?: IHandleRes
}



export default class HappyRedux {
    private store: Store
    private hydrateData: object | null = null
    private reducers: Reducer
    private reduxConfig: IReduxConfig
    private useHydrateData: IUseHydrateData | false
    private isBrowser: boolean = typeof document === 'object'
    private checkRes: ICheckRes
    private handleRes: IHandleRes
    constructor(options: IPorps) {
        this.reduxConfig = options.reduxConfig
        this.useHydrateData = options.useHydrateData || false
        this.checkRes = options.checkRes ? options.checkRes : (res: any) => true
        this.handleRes = options.handleRes ? options.handleRes : (res: any) => res
        this.init()
    }
    private init() {
        this.initHydrateData()
            .initReducers()
            .createStore()
    }
    
    // 创建 store
    private createStore() {
        this.store = createStore(this.reducers)
    }

    // 通过 reduxConfig 转换成 reducers
    private initReducers() {
        const _reducers = {}
        forin(this.reduxConfig, ({ initValue, actions }, stateKey) => {
            const reducerMap = {}
            const value = (this.hydrateData && this.hydrateData[stateKey]) || initValue
            forin(actions, (reducer: (state: any, data: any) => any, action) => reducerMap[action] = reducer)
            _reducers[stateKey] = handleActions(reducerMap, value)
        })
        this.reducers = combineReducers(_reducers)
        return this
    }
    
    // 使用 ssr 传递的数据
    private initHydrateData() {
        if (!this.useHydrateData) return this
        const hydrateElId = this.useHydrateData.elId
        if(this.isBrowser) {
            const hydratedEl = document.getElementById(hydrateElId)
            if (hydratedEl && hydratedEl.textContent) {
                try {
                    this.hydrateData = JSON.parse(hydratedEl.textContent)
                    // setTimeout(() => document.body.removeChild(hydratedEl), 0)
                } catch (error) {
                    console.error(`[getHydrateData error]error: ${error}`)
                }
            }
        }
        return this
    }

    // 获取 store
    public getStore() {
        !this.store && this.init()
        return this.store
    }

    // 获取 reducers
    public getReducers() {
        !this.reducers && this.initReducers()
        return this.reducers
    }

    // 连接属性
    private connectState(stateKeys: string[]){
        return (state: any) => {
            const _o = {}
            stateKeys.map(v => _o[v] = state[v])
            return _o
        }
    }

    // 连接方法
    private connectDispatch(dispatchMap: any) {
        return (dispatch: any) => {
            const _o = {}
            forin(dispatchMap, (v: any, k) => {
                _o[k] = (...data: any[]) => {
                    const typeV = type(v)
                    if(typeV === 'string') {
                        dispatch(createAction(v)(...data))
                    }else if(typeV === 'object') {
                        if (type(v.fetch) === 'function' ) {
                            return v.fetch(...data).then((res: any) => {
                                if (this.checkRes(res)) {
                                    dispatch(createAction(v.success)(this.handleRes(res)))
                                    return res
                                } else {
                                    return Promise.reject(res)
                                }
                            }).catch((err: any) => {
                                dispatch(createAction(v.error || 'ADD_ERROR')(err))
                                return Promise.reject(err)
                            })
                        } else if (type(v.action) === 'string') {
                            dispatch(createAction(v.action)(...data))
                        } else {
                            throw new Error('[dispatchMap error!]')
                        }
                    }
                }
            })
            return _o
        }
    }

    private getDefaultDispatchMap(stateKeys: string[]) {
        const dispatchMap = {}
        stateKeys.map(key => {
            const actions = this.reduxConfig[key].actions
            Object.keys(actions).map(actionName => {
                const propsName = toHump(actionName)
                dispatchMap[propsName] = actionName
            })
        })
        return this.connectDispatch(dispatchMap)
    }

    public connect(stateKeys: string[], dispatchMap?: object) {
        const stateConnect = this.connectState(stateKeys)
        const dispatchConnect = dispatchMap ? this.connectDispatch(dispatchMap) : this.getDefaultDispatchMap(stateKeys)
        return connect(stateConnect, dispatchConnect)
    }
}




