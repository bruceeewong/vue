/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
// 使用数组的原型创建一个新的对象
export const arrayMethods = Object.create(arrayProto)
// 要修改数组元素的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 执行数组原有的方法
    const result = original.apply(this, args)

    // 获取数组对象的 __ob__ 对象
    const ob = this.__ob__

    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)  // 第三个参数是新增的元素
        break
    }
    // 对于插入的新元素，重新遍历数组元素，设置为响应式
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
