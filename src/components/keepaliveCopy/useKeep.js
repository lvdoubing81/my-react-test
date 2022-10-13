import { useRef, useState } from "react"

export const ACTION_CREATED = 'create' /*缓存创建*/
export const ACTION_ACTIVE = 'active'   /*正在激活*/
export const ACTION_ACTIVED = 'actived' /*激活完成*/
export const ACTION_UPDATE = 'update'   /*更新*/
export const ACTION_UNACTIVE = 'unactive'  /*缓存休眠*/
export const ACTION_UNACTIVED = 'unactived'  /*休眠完成*/
export const ACTION_DESTROY = 'destroy'  /*设置摧毁*/
export const ACTION_DESTROYED = 'destroyed'  /*摧毁完成*/
export const ACTION_CLEAR = 'clear'  /*清除缓存*/

// keepalive类 这个类做什么用的？存储一些组件的方法跟定义组件属性
class Keepalive {
    // 构造器
    constructor(setState, maxLimit) {
        // 用来更新状态
        this.setState = setState
        // 最大限制
        this.maxLimit = maxLimit
        // 缓存组件数组
        this.cacheList = []
        // 不知道干嘛的
        this.kid = -1
    }
    // 构造器之后做什么？ 暴露接口给外部调用
    // 缓存dispatch 定义  传入参数，调用接口类型，缓存组件的一些值
    cacheDispatch({
        type,
        payload
    }){
        // 调用前先判断有没有
        this[type]&&this[type](payload)
        // 如果不是初始化，调用之后立即调用setstate重新渲染
        type !== ACTION_CREATED && this.setState({})
    }
    // 根据传入id去获取组件的状态
    hasAliveStatus(cacheId) {
        const index =  this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index >= 0) return this.cacheList[index].status
        return null
    }
    // 删除Item组件
    destroyItem(payload) {
        const index =  this.cacheList.findIndex(item => item.cacheId === payload)
        if(index === -1) return
        if(this.cacheList[index].status === ACTION_UNACTIVED) {
            this.cacheList.splice(index, 1)
        }
    }
    // 初始化组件
    [ACTION_CREATED](payload) {
        // 初始化组件的时候，该怎么去做？往cachelist里面添加对应数据，然后呢？没然后了，注意一下传值
        // 解构出 子组件-children， 缓存id-cacheId， load-对应的加载方法（方便把缓存组件回传给要视图组件）
        const {
            children,
            load,
            cacheId
        } = payload
        // cacheItem的属性，目前就这5个
        const cacheItem = {
            children: children || this.getKid(), /*这里好像用到了最上面的kid，没有则默认置为-1？*/
            load,
            cacheId,
            status: ACTION_CREATED,
            update:{} /*用来更新的*/
        }
        this.cacheList.push(cacheItem)
    }
    /* 更新 item 状态 */
    [ACTION_UPDATE](payload){
        const {cacheId, children} = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1 ) return
        this.cacheList[index].updater = {}
        this.cacheList[index].children = children
    }
    // 销毁组件
    [ACTION_DESTROY](payload) {
        // 判断是批量销毁还是单个销毁
        if(Array.isArray(payload)) {
            // cacheId.forEach(item => this.destroyItem(item)) 为啥不用这个写法
            payload.forEach(this.destroyItem.bind(this))
        }else {
            this.destroyItem(payload)
        }
    }
    // 激活组件
    // 激活组件的时候做了什么？把缓存组件重新放到视图组件里面去？把状态改成active？
    [ACTION_ACTIVE](payload) {
        const {
            load,
            cacheId
        } = payload
        const index = this.cacheList.findIndex(item => item.cacheId === cacheId)
        if(index === -1)return
        this.cacheList[index].status = ACTION_ACTIVE
        this.cacheList[index].load = load
    }
}
// 其余3个(已激活，休眠，已休眠)状态就只是修改一下状态就够了， 并没有太多其他的操作
[ACTION_ACTIVED, ACTION_UNACTIVE, ACTION_UNACTIVED].forEach(status => {
    // 直接在class的原型上面添加方法 找到对应的item，修改状态，break循环
    Keepalive.prototype[status] = function(payload) {
        for (let index = 0; index < this.cacheList.length; index++) {
            if(this.cacheList[index].cacheId === payload) {
                this.cacheList[index].status = status
                break
            }
        }
    }
})

// 所有接口都定义完了，类也好了，开始导出useKeep函数
// 里面主要是new一个Keepalive类，利用ref永远拿到最新值
export default function useKeep(maxLimit) {
    const keeper = useRef()
    const [, setState] = useState([])
    if(!keeper.current) {
        keeper.current = new Keepalive(setState, maxLimit)
    }
    return keeper.current
}