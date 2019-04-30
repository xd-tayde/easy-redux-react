// 通用 reducer
// 将 payload 直接设置到 state
import Numeral from 'numeral'
import Moment from 'moment'
import _ from 'lodash'

const reducerSetFn = (state: any, data: any) => data.payload

// redux-store
export default {
    // key
    userInfo: {
        // 初始状态
        initValue: null,
        actions: {
            SET_USER_INFO: reducerSetFn,
            CLEAE_MSG_COUNT: (state: any, data: any) => {
                const copyState = Object.assign({}, state)
                if (copyState.msg_unread) {
                    delete copyState.msg_unread[data.payload]
                }
                return copyState
            }
        }
    },
    loginStatus: {
        initValue: ['logining', 'logined', 'unlogin'][0],
        actions: {
            SET_LOGIN_STATUS: reducerSetFn
        }
    },
    homeFeed: {
        // {
        //     recommendFeed: null,  // 顶部轮播推荐位
        //     recommendUser: null,  // 推荐关注的用户
        //     attentionFeed: null,  // 我的关注
        //     livingFeed: null,    // 直播卡片
        //     livingNumber: null,  // 直播人数
        //     channelFeed: []
        // }
        initValue: null,
        actions: {
            SET_HOME_FEED: (state: any, data: any) => {
                const newState = data.payload
                if (newState) {
                    return Object.assign({}, state, newState)
                }
                return state
            },
            SET_LIVING_NUMBER: (state: any, data: any) => {
                const newNum = data.payload
                if (newNum) {
                    return Object.assign({}, state, { livingNumber: newNum })
                }
                return state
            },
            ADD_REST_CHANNEL_FEED: (state: any, data: any) => {
                const newState = data.payload
                const copyState = Object.assign({}, state)
                copyState.channelFeed = [
                    ...copyState.channelFeed,
                    ...newState.channelFeed
                ]
                return copyState
            }
        }
    },
    adBanner: {
        // 全站的广告banner
        // type: homeTop、channel
        // eg: { type: 'homeTop', banners: null }
        initValue: [],
        actions: {
            SET_AD_BANNER: (state: any, data: any) => {
                const newState = data.payload
                const copyState = state.slice(0)
                const inx = _.findIndex(copyState, {type: 'channel'})
                if (inx >= 0) {
                    copyState[inx].banners = newState.banners
                } else {
                    copyState.push(newState)
                }
                return copyState
            }
        }
    },
    channelInfo: {
        initValue: null,
        actions: {
            SET_CHANNEL_INFO: reducerSetFn
        }
    },
    complexSearch: {
        initValue: null,
        actions: {
            SET_COMPLEX_SEARCH: reducerSetFn,
            ADD_COMPLEX_SEARCH: (state: any, data: any) => {
                const newState = data.payload
                if (newState) {
                    const result = Object.assign({}, state, newState)
                    result.data.user = state.data.user
                    result.data.video = state.data.video.concat(
                        newState.data.video
                    )
                    return result
                } else {
                    return state
                }
            }
        }
    },
    liveSearch: {
        initValue: null,
        actions: {
            SET_LIVE_SEARCH: reducerSetFn,
            ADD_LIVE_SEARCH: (state: any, data: any) => {
                const newState = data.payload
                if (newState) {
                    const result = Object.assign({}, state, newState)
                    result.data.user = state.data.user
                    result.data.video = state.data.video.concat(
                        newState.data.video
                    )
                    return result
                } else {
                    return state
                }
            }
        }
    },
    userSearch: {
        initValue: null,
        actions: {
            SET_USER_SEARCH: reducerSetFn,
            ADD_USER_SEARCH: (state: any, data: any) => {
                const newState = data.payload
                if (newState) {
                    const result = Object.assign({}, state, newState)
                    result.data.user = state.data.user.concat(
                        newState.data.user
                    )
                    return result
                } else {
                    return state
                }
            }
        }
    },
    // 猜你想搜
    SearchHotList: {
        initValue: [],
        actions: {
            SET_SEARCH_HOT_LIST: reducerSetFn
        }
    },
    // 频道channel
    ChannelFeedList: {
        initValue: [],
        actions: {
            SET_CHANNEL_FEED_LIST: reducerSetFn,
            ADD_CHANNEL_FEED_LIST: (state: any, data: any) => {
                const copyState = state.slice(0)
                const newState = data.payload
                if (newState) {
                    const inx = _.findIndex(
                        copyState,
                        (c: any) => c.channelId === newState.channelId
                    )
                    if (inx >= 0) {
                        copyState[inx] = Object.assign(
                            {},
                            copyState[inx],
                            newState
                        )
                    } else {
                        copyState.push(newState)
                    }
                }
                return copyState
            },
            ADD_SUB_CHANNEL_FEED: (state: any, data: any) => {
                const copyState = state.slice(0)
                const newState = data.payload
                if (newState) {
                    const inx = _.findIndex(
                        copyState,
                        (p: any) =>
                            p.channelId.toString() ===
                            newState.parentId.toString()
                    )
                    if (inx >= 0) {
                        const childInx = _.findIndex(
                            copyState[inx].children,
                            (c: any) => {
                                return (
                                    c.channelId.toString() ===
                                    newState.channelId.toString()
                                )
                            }
                        )
                        if (childInx >= 0) {
                            copyState[inx].children[childInx].cards = [
                                ...copyState[inx].children[childInx].cards,
                                ...newState.cards
                            ]
                        }
                    }
                }
                console.log('copyState', copyState)
                return copyState
            }
        }
    },
    // 他人中心页_可能感兴趣的作者
    UserDetail: {
        initValue: {
            hotPersonList: [],
            userInfo: {
                name: '-',
                description: '-',
                avatar: '',
                followersCount: 0,
                followingCount: 0
            },
            videoData: {
                videoList: []
            },
            hotsoonData: {
                hotsoonList: []
            }
        },
        actions: {
            SET_HOT_PERSON_LIST: (state: any, data: any) => {
                const hotPersonList: any[] = []
                data.payload.forEach((item: any) => {
                    hotPersonList.push({
                        id: item.user_id,
                        name: item.name,
                        introduce: item.description,
                        avatar: item.avatar_url
                    })
                })
                return { ...state, hotPersonList }
            },
            SET_BASE_INFO: (state: any, data: any) => {
                const {
                    user_info: {
                        name,
                        description,
                        avatar_url,
                        followers_count,
                        following_count
                    }
                } = data.payload
                const userInfo = {
                    name,
                    description,
                    avatar: avatar_url,
                    followersCount: followers_count,
                    followingCount: following_count
                }
                return { ...state, userInfo }
            },
            SET_VIDEO_LIST: (state: any, data: any) => {
                const { raw, loadMoreKey } = data.payload
                const { has_more } = raw
                const videoList: any[] = []
                const TIME_FORMAT = '00:00'
                raw.data.forEach((item: any, index: number) => {
                    videoList.push({
                        id: item.group_id_str,
                        videoImage: item.middle_image
                            ? item.middle_image.url
                            : '',
                        blackText: item.video_duration
                            ? Numeral(item.video_duration).format(TIME_FORMAT)
                            : '',
                        videoTitle: item.title,
                        commentNum: item.comment_count,
                        descText: Moment(item.publish_time * 1000).format(
                            'YYYY-MM-HH'
                        ),
                        behotTime: item.behot_time,
                        playNum: item.video_detail_info
                            ? item.video_detail_info.video_watch_count
                            : '',
                        cardClick: () => {
                            window.open(`/i${item.group_id_str}`)
                        }
                    })
                })
                return {
                    ...state,
                    videoData: {
                        videoList: loadMoreKey
                            ? state.videoData.videoList.concat(videoList)
                            : videoList,
                        hasMore: has_more
                    }
                }
            },
            SET_HOTSOON_LIST: (state: any, data: any) => {
                const { raw, loadMoreKey } = data.payload
                const { has_more } = raw
                const hotsoonList: any[] = []
                const TIME_FORMAT = '00:00'
                raw.data.forEach((item: any, index: number) => {
                    hotsoonList.push({
                        id: item.id_str,
                        videoImage: item.large_image_list[0].url,
                        blackText: item.video_duration
                            ? Numeral(item.video_duration).format(TIME_FORMAT)
                            : '',
                        videoTitle: item.title,
                        commentNum: item.action.comment_count,
                        behotTime: item.behot_time,
                        descText: Moment(item.create_time * 1000).format(
                            'YYYY-MM-HH'
                        ),
                        playNum: item.action.play_count,
                        cardClick: () => {
                            window.open(`/i${item.id_str}`)
                        }
                    })
                })
                return {
                    ...state,
                    hotsoonData: {
                        hotsoonList: loadMoreKey
                            ? state
                                .hotsoonData
                                .hotsoonList
                                .concat(hotsoonList)
                            : hotsoonList,
                        hasMore: has_more
                    }
                }
            }
        }
    }
}