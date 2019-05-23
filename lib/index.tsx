import React from 'react'
import { combineReducers, createStore, Reducer, Store } from 'redux'
import { connect, Provider } from 'react-redux'
import { handleActions, createAction } from 'redux-actions'
import { type, forin, toHump } from './utils'

interface IReduxConfig {
    [propsName: string]: {
        initValue: any,
        actions: {
            [propsName: string]: (state: any, data: { payload: number, type: string }) => any,
        },
    }
}

type ICheckRes = (res: any) => boolean
type IHandleRes= (res: any) => any

interface IPorps {
    reduxConfig: IReduxConfig
    hydrateData?: object
    checkRes?: ICheckRes
    handleRes?: IHandleRes
}

const OUTPUT = {
    _pre: `[easy-redux-react]`,
    warn: (msg: string) => {
        console.warn(`${OUTPUT._pre}warn: ${msg}`)
    },
    error: (msg: string) => {
        throw new Error(`${OUTPUT._pre}error: ${msg}.`)
    },
}

export default class EasyReduxReact {
    // redux store
    private store: Store
    private hydrateData: object | null = null
    private reducers: Reducer
    private reduxConfig: IReduxConfig
    private checkRes: ICheckRes
    private handleRes: IHandleRes
    private Provider
    private connect
    constructor(options: IPorps) {
        const {
            reduxConfig,
            hydrateData = null,
            checkRes = () => true,
            handleRes = (res: any) => res,
        }  = options
        this.reduxConfig = reduxConfig
        this.hydrateData = hydrateData
        this.checkRes = checkRes
        this.handleRes = handleRes
        this.connect = connect
        this.Provider = Provider
        this.init()
    }
    private init() {
        this.initReducers()
            .createStore()
    }

    // 创建 store
    private createStore() {
        this.store = createStore(this.reducers)
    }

    // 通过 reduxConfig 转换成 reducers
    private initReducers() {
        const _reducers = {}
        forin(this.reduxConfig, ({ initValue, actions }, stateKey: string) => {
            const reducerMap = {}
            const value = (this.hydrateData && this.hydrateData[stateKey]) || initValue
            forin(actions, (reducer: (state: any, data: any) => any, action) => reducerMap[action] = reducer)
            _reducers[stateKey] = handleActions(reducerMap, value)
        })
        this.reducers = combineReducers(_reducers)
        return this
    }

    // 连接属性
    private connectState(stateKeys: string[]) {
        return (state: any) => {
            const _o = {}
            stateKeys.map((v) => _o[v] = state[v])
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
                    if (typeV === 'string') {
                        dispatch(createAction(v)(...data))
                    } else if (typeV === 'object') {
                        if (type(v.fetch) === 'function') {
                            return v.fetch(...data).then((res: any) => {
                                if (this.checkRes(res)) {
                                    if (v.success) {
                                        dispatch(createAction(v.success)(this.handleRes(res)))
                                        OUTPUT.warn('the dispatchMap item should have a success action.')
                                    }
                                    return res
                                } else {
                                    return Promise.reject(res)
                                }
                            }).catch((err: any) => {
                                v.error && dispatch(createAction(v.error)(err))
                                return Promise.reject(err)
                            })
                        } else if (type(v.action) === 'string') {
                            dispatch(createAction(v.action)(...data))
                        } else {
                            OUTPUT.error('dispatchMap error!')
                        }
                    }
                }
            })
            return _o
        }
    }

    private getDefaultDispatchMap(stateKeys: string[]) {
        const dispatchMap = {}
        stateKeys.map((key) => {
            const actions = this.reduxConfig[key].actions
            Object.keys(actions).map((actionName) => {
                const propsName = toHump(actionName)
                dispatchMap[propsName] = actionName
            })
        })
        return dispatchMap
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

    // 连接组件
    public connectTo(
        module: object,
        stateKeys: string[] = Object.keys(this.reduxConfig),
        dispatchMap: object = this.getDefaultDispatchMap(stateKeys),
    ) {
        if (!module) {
            OUTPUT.error(`the first parameter must be a react component to connect`)
        }
        const stateConnect = this.connectState(stateKeys)
        const dispatchConnect = this.connectDispatch(dispatchMap)
        return this.connect(stateConnect, dispatchConnect)(module)
    }

    public getProvider() {
        const Provider = this.Provider
        return (props) => (
            <Provider store={this.getStore()}>
                {props.children}
            </Provider>
        )
    }
}
