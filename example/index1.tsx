import * as React from 'react'
import { Provider } from 'react-redux'
import EasyReduxReact from '../lib/easy-redux-react'
import reduxConfig from './config'

type type_reduxConfig = typeof reduxConfig
type type_storeKey = {
    [key in keyof type_reduxConfig]: key
}
export const storeKey = {} as type_storeKey
Object.keys(reduxConfig).map((stateKey) => storeKey[stateKey] = stateKey)
const _ins = new EasyReduxReact({
    reduxConfig,
    useHydrateData: {
        elId: '',
    },
})

export const store = _ins.getStore()
export const dispatch = store.dispatch
export const getState = store.getState
export const subscribe = store.subscribe
export const connectTo = (stateKeys: string[], dispatchMap?: object) => {
    return _ins.connectTo.bind(_ins)(stateKeys, dispatchMap)
}
export function StoreProvider(props: any) {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
}

export default _ins
