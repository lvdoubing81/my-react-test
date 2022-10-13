import ReactDOM from 'react-dom'
import { cloneElement, createContext, isValidElement, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import useKeep, { ACTION_UNACTIVE, ACTION_ACTIVE, ACTION_CREATED, ACTION_DESTROY, ACTION_UNACTIVED, ACTION_UPDATE, ACTION_ACTIVED } from "./useKeep";
// context传递的值
const KeepaliveContext = createContext({})
// 这是一个值，用来判断scopeItem组件是否仍然保持当前状态
const keepChange = (pre, next) => pre.status === next.status && pre.updater === next.updater
const beforeScopeDestory = {}
// useKeep定义好了之后，开始定义组件
// 首先是缓存列表的组件
// 这个组件是做什么的？该怎么去定义？
// 组件是用来缓存所有组件的， 所有缓存组件都存在cachelist里面，所以需要先试用定义好的useKeep去新增一颗keeper类
// 然后根据cachelist去循环渲染对应的缓存组件
// 数据通过context来传递，（后面也许要换成redux？）
// 传参时候，需要传入子组件children
export function KeepaliveScope({children}) {
    const keeper = useKeep()
    const { cacheDispatch, cacheList, hasAliveStatus } = keeper /*把之前定义好的接口解构出来，等待使用*/
    const renderChildren = children /**渲染子组件 */
    // 然后呢 上面那些东西解构出来怎么用？
    // 在初始化的时候做了什么？通过副作用又做了什么？
    useEffect(()=>{
        // 这里是为了防止scope销毁的时候带来的一些问题
        return function() {
            try {
                // beforeScopeDestory是一开始就定义的，用来存放啥？
                // 不知道，只知道它调用了一个函数，不知道跑啥
                for (let key in beforeScopeDestory) {
                    beforeScopeDestory[key]()
                }
            } catch (error) {}
        }
    },[])
    // 通过useMemo又做了什么？为什么要用useMemo，contextValue传下去的是什么？
    // contextValue传递下去的是每个子组件的状态 为了防止scope组件重新渲染导致context的值发生变化，所以用useMemo
    // useMemo返回的是一个对象，这个对象把keeper暴露的方法存进去了，这样子组件里面也能直接用这些方法？不是说好传的子组件状态么？这些是啥？
    const contextValue = useMemo(()=>{
        return {
            cacheDispatch: cacheDispatch.bind(keeper),
            hasAliveStatus: hasAliveStatus.bind(keeper),
            cacheDestroy: (payload) => cacheDispatch.call(keeper, {type: ACTION_DESTROY, payload})
        }
    },[keeper])
    return <KeepaliveContext.Provider value={contextValue}>
        {renderChildren}
        { /* 用一个列表渲染  */ }
        {cacheList.map(item => <ScopeItem {...item} dispatch={cacheDispatch.bind(keeper)} key={item.cacheId} />)}
    </KeepaliveContext.Provider>
}

// ScopeItem是做什么的？有什么用？怎么去定义？为什么要这样去定义？
// 这是那个视图组件吧？有挂载方法，在对应的父组件下展示的，后面会跟缓存组件有勾搭
// 看代码，这好像是缓存组件啊，另一个才是页面的视图组件？？？？因为它是挂载在body上面的啊
// 返回的是什么东西？
// 子组件，总要优先传值吧？那么这里面都有什么值？ 组件id得有吧，更新判断依据，里面是否有子组件，当前组件的状态， dispatch的方法（这不重复了？），渲染方法load，默认空函数
const ScopeItem = memo(function({cacheId, updater, children, status, dispatch, load=()=>{}}) {
    // 当前dom，到时候还得把这传给视图组件重新渲染？
    const currentDOM = useRef()
    // 渲染子组件，只有在激活中或者休眠中才渲染子组件，其他时候都返回null 子组件居然是个函数
    const renderChildren = status === ACTION_ACTIVE || status === ACTION_ACTIVED || status === ACTION_UNACTIVE || status === ACTION_UNACTIVED ? children : () => null
    // 拿到这些值怎么用？怎么去渲染？
    // 通过reactDom渲染组件，产生dom树结构 原话是这样的
    const element = ReactDOM.createPortal(
        // 只有休眠时候才隐藏， 其他时候都不隐藏？
        <div ref={currentDOM} style={{display: status === ACTION_UNACTIVED ? 'none' : 'block'}}>
            {   useMemo(()=> renderChildren(),[updater])    }
        </div>,
        document.body
    )
    // 这里副作用做了什么？防止销毁时候有影响？什么影响？
    // 防止scope销毁时候找不到dom 
    useEffect(()=>{
        beforeScopeDestory[cacheId] = function() {
            if(currentDOM.current) document.body.appendChild(currentDOM.current)
        }
        return function() {
            delete beforeScopeDestory[cacheId]
        }
    },[])
    useEffect(()=>{
        // 激活时候回传
        if(status === ACTION_ACTIVE) {
            load && load(currentDOM.current)
        } else if (status === ACTION_UNACTIVE) {
            // 如果休眠，则把元素挂载在body上\
            // 不需要注销掉的吗？这样不会越来越多？
            document.body.appendChild(currentDOM.current)
            // 把状态变为已休眠
            dispatch({
                type: ACTION_UNACTIVED,
                payload: cacheId
            })
        }
    },[status])
    return element
},keepChange)

// 这是渲染子组件的，判断是否为函数，有没有携带props参数丢下去之类的
const renderWithChildren = (children) => (mergeProps) => {
    return  children ? 
        typeof children === 'function' ? children(mergeProps) : (isValidElement(children) ? cloneElement(children, mergeProps) : null )
        : null
}
// 这是视图层组件，组件里面的东西都会被缓存起来
// 一共三个传参，children，cacheId，样式
export function KeepaliveItem({
    children,
    cacheId,
    style
}) {
    // 这样玩居然都没有undefine？这里是useContext传下来的东西吗？明明是上面新增的啊，里面不是空数组？为什么会有东西？
    const {
        cacheDispatch,
        hasAliveStatus
    } = useContext(KeepaliveContext)
    // 然后呢？又做了什么？拿到了暴露出来的接口之后
    // 找父id？
    // 先判断是不是第一次加载，然后再找parentNode
    const first = useRef(false)
    const parentNode = useRef(null)
    // 暴露给外面的load方法，parentNode不是空的吗？为什么直接在空元素上面appendchild了？
    // 下面有用到，空不空没关系了
    const load = (currentNode) => {parentNode.current.appendChild(currentNode)}
    // 判断第一次加载 这么多判断条件，判断是否第一次，判断之前是否有状态，还要判断传下来的context的缓存操作方法有没有存在
    // 噢。不是判断方法有没存在，而是直接调用了初始化方法 传参就id，load方法，以及子组件
    !first.current && !hasAliveStatus(cacheId) && cacheDispatch({
        type: ACTION_CREATED,
        payload: {
            load,
            cacheId,
            children: renderWithChildren(children)
        }
    })
    // 这里副作用给的不知道为啥
    // 主要是想着，父组件更新的时候，发一条update指令下去，让下面子组件也跟着更新
    useLayoutEffect(()=>{
        // 不是第一次渲染，而且状态不等于休眠中
        hasAliveStatus(cacheId) !== ACTION_UNACTIVED && first.current && cacheDispatch({
            type: ACTION_UPDATE,
            payload: {
                cacheId,
                children: renderWithChildren(children)
            }
        })
    },[children])
    // 这里副作用又是为啥
    // 上面是跟随父组件更新，这里就是初始化的时候执行激活操作，销毁的时候执行缓存操作
    // 因为最上面已经执行过初始化了，所以这里直接激活
    useEffect(()=>{
        first.current = true
        cacheDispatch({
            type: ACTION_ACTIVE,
            payload: {
                cacheId,
                load
            }
        })
        return function() {
            cacheDispatch({
                type: ACTION_UNACTIVE,
                payload: cacheId
            })
        }
    },[])
    // 上面的parentNode是在这里用到了，哪怕是空也无关紧要？把div丢出去，div下面直接就有子组件渲染出来的，所以可以直接作为视图层展示
    // 视图层有了，但是跟缓存那边怎么交互的呢？关键就是上面2个副作用了吧
    return <div ref={parentNode} style={style} />
}

// 清除缓存
export function useCacheDestroy() {
    return useContext(KeepaliveContext).cacheDestroy
}