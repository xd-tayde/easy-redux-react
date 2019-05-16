// 通用 reducer
// 将 payload 直接设置到 state
import _ from "lodash"

const reducerSetFn = (state: any, data: any) => data.payload

// redux-store
export default {
    // key
    loginStatus: {
        // 初始状态
        initValue: null,
        actions: {
            SET_LOGIN_STATUS: (state: any, data: any) => {
                return data.payload as boolean
            },
        },
    },
}
