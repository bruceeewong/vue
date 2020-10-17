/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

/**
 * 注册静态属性
 * @param {Vue} Vue Vue的构造函数
 */
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * type: component / directive / filter
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // 如果是组件且传入普通配置object, 自动调用extend返回 Vue.component 构造函数
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id  // 如果没有名称，使用id作为组件名称
          definition = this.options._base.extend(definition)  // 组件的选项转为构造函数
        }
        // 如果是指令，且第二参数是函数
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 存到各自的全局属性中
        // this.options['components']['comp'] = definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
