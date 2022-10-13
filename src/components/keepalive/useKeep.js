
import React from "react"
export const ACITON_CREATED    = 'created'       /* 缓存创建 */
export const ACTION_ACTIVE     = 'active'        /* 缓存激活 */
export const ACTION_ACTIVED    = 'actived'       /* 激活完成 */
export const ACITON_UNACTIVE   = 'unActive'      /* 缓存休眠 */
export const ACTION_UNACTIVED  = 'unActived'     /* 休眠完成 */
export const ACTION_DESTROY    = 'destroy'       /* 设置摧毁状态 */
export const ACTION_DESTROYED  = 'destroyed'     /* 摧毁缓存 */
export const ACTION_CLEAR      = 'clear'         /* 清除缓存 */
export const ACTION_UPDATE     = 'update'        /* 更新组件 */


class Keepalive {
    constructor(setState, maxLimit) {
        this.setState = setState
        this.maxLimit = maxLimit
        this.cacheList = []
        this.kid = -1
    }
    /* 暴露给外部使用的切换状态的接口 */
    cacheDispatch ({
        type,
        payload
    }) {
        this[type] && this[type](payload)
        type !== ACITON_CREATED && this.setState({})
    }
    /* 获取每一个 item 的状态 */
    hasAliveStatus (cacheId) {
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index >=0 ) return this.cacheList[index].status
        return null
    }
    /* 删掉缓存 item 组件 */
    destroyItem(payload){
        const index = this.cacheList.findIndex(item => item.cacheId === payload)
        if(index === -1 ) return
        if(this.cacheList[index].status === ACTION_UNACTIVED ){
             this.cacheList.splice(index,1)
        }
    }
    /* 更新 item 状态 */
    [ACTION_UPDATE](payload){
        const { cacheId, children } = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1 ) return
        this.cacheList[index].updater = {}
        this.cacheList[index].children = children
    }
    /* 初始化状态，创建一个item */
    [ACITON_CREATED](payload) {
        const {
            children,
            load,
            cacheId
        } = payload
        const cacheItem = {
            cacheId: cacheId || this.getKid(),
            load,
            status: ACITON_CREATED,
            children,
            updater:{}
        }
        this.cacheList.push(cacheItem)
    }
    /* 正在销毁状态 */
    [ACTION_DESTROY](payload) {
        if (Array.isArray(payload)) {
             payload.forEach(this.destroyItem.bind(this))
        } else {
             this.destroyItem(payload)
        }
    }
    /* 正在激活状态 */
    [ACTION_ACTIVE](payload){
        const { cacheId, load } = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1 ) return
        this.cacheList[index].status = ACTION_ACTIVE
        this.cacheList[index].load = load
    }
}
/* 激活完成状态，正在休眠状态，休眠完成状态 */
[ACITON_UNACTIVE, ACTION_ACTIVED, ACTION_UNACTIVED].forEach(status => {
    Keepalive.prototype[status] = function (payload) {
        for (let i = 0; i < this.cacheList.length; i++) {
            if (this.cacheList[i].cacheId === payload) {
                this.cacheList[i].status = status
                break
            }
        }
    }
})

export default function useKeep(CACHE_MAX_DEFAULT_LIMIT) {
    const keeper = React.useRef()
    const [, setKeepItems] = React.useState([])
    if (!keeper.current) {
        keeper.current = new Keepalive(setKeepItems, CACHE_MAX_DEFAULT_LIMIT)
    }
    return keeper.current
}