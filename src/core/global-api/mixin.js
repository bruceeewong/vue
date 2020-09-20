/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 将传来的选项，合并到 Vue.options 全局选项中
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
