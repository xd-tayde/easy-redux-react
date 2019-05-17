// console.log(1)
// import "./main.scss"
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import EasyReduxReact from '../lib/easy-redux-react'
import reduxConfig from './config'

const mountNode = document.getElementById('App') as HTMLElement

const _ins = new EasyReduxReact({ reduxConfig })
console.log(_ins)

const store = _ins.getStore()

export const connectTo = (stateKeys: string[], dispatchMap?: object) => {
    return _ins.connectTo.bind(_ins)(stateKeys, dispatchMap)
}

const Home = (props) => {
    console.log('home props', props)
    return (
        <div>Home</div>
    )
}

const mapStateToProps = (state) => {
    return {
        loginStatus: state.loginStatus,
    }
}

connect(
    mapStateToProps,
    {},
)(Home)

class Make extends React.Component {
    public render() {
        return (
            <div>Make</div>
        )
    }
}

// connectTo(['loginStatus'])(Make)
// console.log(1, store.getState())

// store.dispatch({
//     type: 'SET_LOGIN_STATUS',
//     payload: true,
// })

// console.log(2, store.getState())

class App extends React.Component {
    public render() {
        return (
            <div>App: <Home /><Make /></div>
        )
    }
}

console.log(3)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    mountNode,
)
