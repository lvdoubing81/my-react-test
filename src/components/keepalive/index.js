
import ReactDOM from 'react-dom'
import React, {cloneElement, isValidElement, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import useKeep, { ACITON_CREATED, ACITON_UNACTIVE, ACTION_ACTIVE, ACTION_ACTIVED, ACTION_DESTROY, ACTION_UNACTIVED, ACTION_UPDATE } from "./useKeep"
const KeepaliveContext = React.createContext({})
const keepChange = (pre, next) => pre.status === next.status && pre.updater === next.updater
const beforeScopeDestroy = {}

export function KeepaliveScope({ children }) {
    /* 产生一个 keepalive 列表的管理器 */
    const keeper = useKeep()
    const { cacheDispatch, cacheList, hasAliveStatus } = keeper
    /* children 组合模式 */
    const renderChildren = children
    /* 处理防止 Scope 销毁带来的问题。 */
    useEffect(() => {
        return function () {
            try {
                for (let key in beforeScopeDestroy) {
                    beforeScopeDestroy[key]()
                }
            } catch (e) { }
        }
    }, [])
    const contextValue = useMemo(() => {
        return {
            /* 增加缓存 item | 改变 keepalive 状态 | 清除 keepalive  */
            cacheDispatch: cacheDispatch.bind(keeper),
            /* 判断 keepalive 状态 */
            hasAliveStatus: hasAliveStatus.bind(keeper),
            /* 提供给 */
            cacheDestroy: (payload) => cacheDispatch.call(keeper, { type: ACTION_DESTROY, payload })
        }
    }, [keeper])
    return <KeepaliveContext.Provider value={contextValue}>
        {renderChildren}
        { /* 用一个列表渲染  */ }
        {cacheList.map(item => <ScopeItem {...item} dispatch={cacheDispatch.bind(keeper)} key={item.cacheId} />)}
    </KeepaliveContext.Provider>
}

const ScopeItem = memo(function ({ cacheId, updater, children, status, dispatch, load = () => { } }) {
    const currentDOM = useRef()
    const renderChildren = status === ACTION_ACTIVE || status === ACTION_ACTIVED || status === ACITON_UNACTIVE || status === ACTION_UNACTIVED ? children : () => null
    /* 通过 ReactDOM.createPortal 渲染组件，产生 dom 树结构 */
    const element = ReactDOM.createPortal(
        <div ref={currentDOM} style={{ display: status === ACTION_UNACTIVED ? 'none' : 'block' }} >
            {/* 当 updater 对象变化的时候，重新执行函数，更新组件。 */}
            {   useMemo(() => renderChildren(), [updater])  }
        </div>,
        document.body
    )
    /* 防止 Scope 销毁，找不到对应的 dom 而引发的报错 */
    useEffect(() => {
        beforeScopeDestroy[cacheId] = function () {
            if (currentDOM.current) document.body.appendChild(currentDOM.current)
        }
        return function () {
            delete beforeScopeDestroy[cacheId]
        }
    }, [])
    useEffect(() => {
        if (status === ACTION_ACTIVE) {
            /* 如果已经激活了，那么回传 dom  */
            load && load(currentDOM.current)
        } else if (status === ACITON_UNACTIVE) {
            /* 如果处于休眠状态，那么把 dom 元素重新挂载到 body 上 */
            document.body.appendChild(currentDOM.current)
            /* 然后下发指令，把状态变成休眠完成 */
            dispatch({
                type: ACTION_UNACTIVED,
                payload: cacheId
            })
        }
    }, [status])
    return element
}, keepChange)


const renderWithChildren = (children) => (mergeProps) => {
    return children ?
        typeof children === 'function' ?
        children(mergeProps) :
        isValidElement(children) ?
        cloneElement(children, mergeProps) :
        null :
        null
}

export function KeepaliveItem({
    children,
    cacheId,
    style
}) {
    /*  */
    const {
        cacheDispatch,
        hasAliveStatus
    } = useContext(KeepaliveContext)
    const first = useRef(false)
    const parentNode = useRef(null)
    /* 提供给 ScopeItem 的方法  */
    const load = (currentNode) => {
        parentNode.current.appendChild(currentNode)
    }
    /* 如果是第一次，那么证明没有缓存，直接调用 created 指令，创建一个   */
    !first.current && !hasAliveStatus(cacheId) && cacheDispatch({
        type: ACITON_CREATED,
        payload: {
            load,
            cacheId,
            children: renderWithChildren(children)
        }
    })
    useLayoutEffect(() => {
        /* 触发更新逻辑，如果父组件重新渲染了，那么下发 update 指令，更新 updater  */
        hasAliveStatus(cacheId) !== ACTION_UNACTIVED && first.current && cacheDispatch({
            type: ACTION_UPDATE,
            payload: {
                cacheId,
                children: renderWithChildren(children)
            }
        })
    }, [children])
    useEffect(() => {
        first.current = true
        /* 触发指令 active */
        cacheDispatch({
            type: ACTION_ACTIVE,
            payload: {
                cacheId,
                load
            }
        })
        return function () {
            /* KeepaliveItem 被销毁，触发 unActive 指令，让组件处于休眠状态  */
            cacheDispatch({
                type: ACITON_UNACTIVE,
                payload: cacheId
            })
        }
    }, [])
    /* 通过 parentNode 接收回传过来的 dom 状态。 */
    return <div ref={parentNode} style={style}/>
}

export function useCacheDestroy() {
    return useContext(KeepaliveContext).cacheDestroy
}