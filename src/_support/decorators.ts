/**
 * Component registration helpers for ReAPI.
 *
 * These functions attach metadata to components that the Rollup plugin
 * scans at build time to generate the registration arrays automatically.
 */

export interface AssertionMeta {
  id: string
  displayName?: string
  description?: string
  noOfParams: 1 | 2 | 3
  enabled?: boolean
  tested?: boolean
  deprecated?: boolean
}

export interface ValueGeneratorMeta {
  id: string
  displayName?: string
  description?: string
  noOfParams?: 0 | 1
  enabled?: boolean
  tested?: boolean
  deprecated?: boolean
}

export interface HookMeta {
  id: string
  displayName?: string
  description?: string
  type: 'BEFORE_REQUEST' | 'AFTER_RESPONSE'
  enabled?: boolean
  tested?: boolean
  deprecated?: boolean
}

export interface UtilityMeta {
  id: string
  displayName?: string
  description?: string
}

// Type for functions with attached metadata
export interface ComponentFunction<T> extends Function {
  __meta__: T
  __type__: string
}

/**
 * Registers an assertion function with metadata.
 * Usage: export const isInt = assertion({ id: 'is-int', noOfParams: 1 }, (value) => { ... })
 */
export function assertion<F extends Function>(
  meta: AssertionMeta,
  fn: F
): F & ComponentFunction<AssertionMeta> {
  const component = fn as F & ComponentFunction<AssertionMeta>
  component.__meta__ = meta
  component.__type__ = 'assertion'
  return component
}

/**
 * Registers a value generator function with metadata.
 * Usage: export const now = valueGenerator({ id: 'now', noOfParams: 0 }, () => { ... })
 */
export function valueGenerator<F extends Function>(
  meta: ValueGeneratorMeta,
  fn: F
): F & ComponentFunction<ValueGeneratorMeta> {
  const component = fn as F & ComponentFunction<ValueGeneratorMeta>
  component.__meta__ = meta
  component.__type__ = 'valueGenerator'
  return component
}

/**
 * Registers an API hook function with metadata.
 * Usage: export const myHook = hook({ id: 'my-hook', type: 'beforeRequest' }, async () => { ... })
 */
export function hook<F extends Function>(
  meta: HookMeta,
  fn: F
): F & ComponentFunction<HookMeta> {
  const component = fn as F & ComponentFunction<HookMeta>
  component.__meta__ = meta
  component.__type__ = 'hook'
  return component
}

/**
 * Marks a class as a utility.
 * The class will be automatically registered in the utilities array.
 */
export function Utility(meta: UtilityMeta) {
  return function <T extends new (...args: any[]) => any>(target: T) {
    ;(target as any).__meta__ = meta
    ;(target as any).__type__ = 'utility'
    return target
  }
}
