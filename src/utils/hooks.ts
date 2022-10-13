import produce from "immer";
import { useCallback, useEffect, useRef, useState } from "react";


export function useSetState(initalState) {
    // 正常useState
    const [_state, _setState] = useState(initalState)
    // setState用useCallback包裹一下
    const setState = useCallback((state)=>{
        // 外部setState的时候，获取一下新旧值
        _setState((prev)=>{
            let nextState = state
            // 判断传入是否够为函数
            if(typeof state === 'function') {
                nextState = state(prev)
            }
            // 将新旧数据解构放入新对象中 这样即便只传一个属性值，也不会当成新对象直接覆盖
            return {...prev, ...nextState}
        })
        return [_state, setState]
    },[])
}

// 强制刷新
export function useForceUpdate() {
    // 从0开始
    const [, setState] = useState(0)
    // 累加，达到刷新组件的目的
    return useCallback(()=>{
        setState(value => (value + 1) % (Number.MAX_SAFE_INTEGER - 1))
    },[])
}
// 获取上一次的值
export function usePrevious(value) {
    const ref = useRef()
    // 使用useEffect获取值，但这只会在渲染之后才获取，也就是上一次的值
    useEffect(()=>{
        ref.current = value
    },[])
    return ref.current
}
// 简化不可变数据操作
export function useImmer(initalState) {
    const [val, updateValue] = useState(initalState)
    return [
        val,
        useCallback(updater=>{
            // 直接用produce就好了=。=
            updateValue(produce(updater))
        }, [])
    ]
}

export function useRefProps(props) {
    // 利用ref来获取最新的props数据 因为ref里面获取的内容是最新的
    const ref = useRef(props)
    ref.current = props
    return ref
}

// 利用副作用模拟生命周期
export function useOnMount(fn) {
    useEffect(()=>{
        fn()
    },[])
} 
// 利用副作用模拟生命周期
export function useOnUnmount(fn) {
    useEffect(()=>{
        return ()=>{
            fn()
        }
    },[])
}
export function useOnUpdate(fn, dep?:any[]) {
    const ref = useRef({fn, mounted: false})
    ref.current.fn = fn
    useEffect(()=>{
        // 第一次更新不调用函数
        if (!ref.current.mounted) {
            ref.current.mounted = true
        } else {
            ref.current.fn()
        }
    },dep)
}
// 防抖
export function useDebounce(fn: ()=> void, args?:any[], ms: number = 300, skipMount?: boolean) {
    const mounted = useRef(false)
    useEffect(()=>{
        if(skipMount && !mounted.current) {
            mounted.current  = true
            return undefined
        }
        const timer = setTimeout(fn, ms);
        return () => {
            // 如果arg出现变化，先清定时器
            clearTimeout(timer)
        }
    },args)
}
// 节流
export function useThrottle(fn: Function, delay:number = 300){
    const timer = useRef<any>()
    return useCallback(()=>{
        if(timer.current) return
        fn()
        timer.current = setTimeout(() => {
            timer.current = null
        }, delay);
    },[delay])
}


export function useStorage(key,defaultValue,keepOnWindowClosed) {
    const storage = keepOnWindowClosed ? localStorage : sessionStorage
    const getStorageValue =  ()=> {
        try {
            const storageValue = storage.getItem(key)
            if(storageValue != null) {
                return JSON.parse(storageValue)
            } else if (defaultValue) {
                const value = typeof defaultValue === 'function' ? defaultValue() : defaultValue
                storage.setItem(key, JSON.stringify(value))
                return value
            }
        } catch (error) {
            console.warn(`useStorage 无法获取${key}: `, error)
        }

        return undefined
    }

    const [value, setValue] = useState(getStorageValue)
    // 保存
    const save = useCallback(value=>{
        setValue(prev => {
            const finalValue = typeof value === 'function' ? value(prev) : value
            storage.setItem(key, JSON.stringify(finalValue))
            return finalValue
        })
    },[])

    const clear = useCallback(()=>{
        storage.removeItem(key)
        setValue(undefined)
    },[])

    return [value, save, clear]
}


