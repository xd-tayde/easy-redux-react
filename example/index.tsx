import "./main.scss"
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import EasyReduxReact from '../lib/easy-redux-react'

const mountNode = document.getElementById('App') as HTMLElement

const _ins = new EasyReduxReact({
    reduxConfig: {
        // key
        list: {
            // initState
            initValue: [],
            // actions map
            actions: {
                // action name: reducer
                ADD_LIST: (state: any[], data: { payload: any, type: string }) => {
                    return state.concat(data.payload)
                },
                REMOVE_LIST: (state: any[], data: { payload: number, type: string }) => {
                    const _list = [...state]
                    _list.splice(data.payload, 1)
                    return _list
                },
            },
        },
    },
    hydrateData: {

    },
 })

const store = _ins.getStore()

const App = (props) => {
    console.log('home props', props)
    const [ inputValue, onInput ] = useState('')
    const { list, addList, removeList } = props
    return (
        <div className="">
            <h1>Easy-redux-react App</h1>
            <ul>
                <li>TODOs:</li>
                {list.map((v: string, index: number) => {
                    return (
                        <li key={index}>
                            {v}
                            <i className="remove"
                                onClick={() => {removeList(index)}}
                            >X</i>
                        </li>
                    )
                })}
            </ul>
            <div className="add">
                <input type="text" value={inputValue}
                    onChange={(e) => {
                        onInput(e.target.value)
                    }}
                />
                <div onClick={() => {
                        inputValue && addList(inputValue)
                    }}
                >Add To List</div>
            </div>
        </div>
    )
}

const ReduxApp = _ins.connectTo(App)

ReactDOM.render(
    <Provider store={store}>
        <ReduxApp />
    </Provider>,
    mountNode,
)
