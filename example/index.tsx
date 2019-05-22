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
            initValue: ['todo-1111', 'todo-2222', 'todo-33333333', 'todo-4444444'],
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
 })

const store = _ins.getStore()

const App = (props) => {
    const [ inputValue, onInput ] = useState('')
    const { list, addList, removeList } = props
    return (
        <div className="App">
            <h1>Easy-Redux-React App</h1>
            <div className="add">
                <input type="text" value={inputValue}
                    onChange={(e) => {
                        onInput(e.target.value)
                    }}
                />
                <div className="add-btn" onClick={() => {
                        inputValue && addList(inputValue)
                        onInput('')
                    }}
                >Add To List</div>
            </div>
            <div className="todos">
                <h2 className="title">TODOs:</h2>
                <ul className="list">
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
