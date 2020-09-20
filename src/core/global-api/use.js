/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 检测是否已经注册，如果有，直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 获取额外的参数, 把数组中的第一个元素 (plugin) 去除
    const args = toArray(arguments, 1)
    // 把 this(Vue)构造函数 插入第一个元素的位置，因为install方法第一个参数是 Vue
    args.unshift(this)

    // 规定插件必须有 install 函数
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
