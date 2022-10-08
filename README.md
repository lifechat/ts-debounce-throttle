# TypeScript implementation of debounce and throttle function

[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/ts-debounce-throttle.svg)](https://www.npmjs.com/package/ts-debounce-throttle)
[![npm type definitions](https://img.shields.io/npm/types/ts-debounce-throttle.svg)](https://www.npmjs.com/package/ts-debounce-throttle)

Debounce 创建了一个新的函数 g，当它被调用时，会将原函数 f 的调用延迟到 n 毫秒，但如果在 n 毫秒之前有新的调用，就会放弃之前的延迟排放。

在限制函数调用次数的情况下，这是非常有用的。例如，考虑从 API 获取数据的搜索输入。在用户停止输入字符一段时间后显示搜索结果就足够了。

## Install

你可以使用`npm`来安装这个软件包，命令如下

```bash
npm i @lifechat/debounce-throttle
```

如果你喜欢`yarn'，可以用下面的命令安装

```bash
yarn add @lifechat/debounce-throttle
```

## 函数参数

```ts
import { debounce } from '@lifechat/debounce-throttle'

const debouncedFunction = debounce(originalFunction, waitMilliseconds, options)
```

- `originalFunction`
  - 我们需要 debounce 的函数
- `waitMilliseconds`
  - 在最近一次函数调用后，必须经过多少秒，才能调用原始函数
- `options`
  - `isImmediate` (boolean)
    - 如果设置为 "true"，那么 "originalFunction "将被立即调用，但在随后的调用中，原始函数将不会被调用，除非 "waitMilliseconds "在最后一次调用后通过。
  - `maxWait` (number)
    - 如果定义了，它将在`maxWait'时间过后调用`originalFunction'，即使在此期间调用了 debounced 函数。
      - 例如，如果`wait`被设置为`100`，`maxWait`被设置为`200`，那么如果每隔 50ms 调用一次 debounced 函数，那么原始函数将在 200ms 后被调用。
  - `callback` (function)
    - 当 "originalFunction "被释放时，它被调用，并接收 "originalFunction "返回的数据作为第一个参数

## 撤销

可以通过对其调用`cancel()`来取消返回的 debounced 函数。

```ts
const debouncedFunction = debounce(originalFunction, waitMilliseconds, options)

debouncedFunction.cancel()
```

## Promises

每次你调用 debounced 函数时，都会返回一个 Promise，这个 Promise 将在原始函数被最终调用时被 resolve。如果 debounced 函数被取消了，这个 Promise 将被 reject 掉。
你也可以去掉一个返回承诺的函数 f。返回的 Promise 将与原始函数的返回值一起解析（除非被取消）。

```ts
const asyncFunction = async () => 'value'
const g = debounce(asyncFunction)
const returnValue = await g()
returnValue === 'value' // true
```
