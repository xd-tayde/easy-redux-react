import * as React from 'react'
import { Provider } from 'react-redux'
import HappyRedux from './happyRedux'
import reduxConfig from './config'

type type_reduxConfig = typeof reduxConfig
type type_storeKey = {
    [key in keyof type_reduxConfig]: key
}
export const storeKey = {} as type_storeKey
Object.keys(reduxConfig).map(stateKey => storeKey[stateKey] = stateKey)

const _ins = new HappyRedux({
    reduxConfig,
    useHydrateData: {
        elId: 'SSR_HYDRATED_DATA'
    },  
})

export const store = _ins.getStore()
export const dispatch = store.dispatch
export const getState = store.getState
export const subscribe = store.subscribe
export const connectTo = (stateKeys: string[], dispatchMap?: object) => _ins.connect.bind(_ins)(stateKeys, dispatchMap)
export function StoreProvider(props: any) {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    )
}

export default _ins