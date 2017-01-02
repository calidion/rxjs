# Observer观察者

**什么是观察者?** 观察者是观察对象所发送数据的消费者。观察者对象简单来说是一组回调函数,分别对应一种被可观察对象发送的通知类型: `next`, `error`, 和 `complete`。 下面是一个很典型的观察者对象的例子：

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```

使用观察者, 需要`订阅`观察者对象：

<!-- skip-example -->
```js
observable.subscribe(observer);
```

<span class="informal">观察者仅仅是由三个回调函数组成的对象, 每个回调函数分别对应观察者对象的通知类型。</span>

观察者在RxJS中是*可选的*。 如果你不想提供某个回调函数,观察者对象仍然会正常执行, 某些类型的通知将不会执行, 因为在观察者对象中没有与之对应的回调函数。

下面的例子是一个没有 `complete` 回调方法的观察者对象:

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
};
```

当对一个观察者对象订阅后, 你可以只提供回调函数作为参数，并不需要完整的观察者对象，例如像这样:

<!-- skip-example -->
```js
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```

在`observable.subscribe`方法内部, 它将使用第一个回调参数作为`next`的句柄创建一个观察者对象。也可以将三种类型的回调函数作为参数提供：

<!-- skip-example -->
```js
observable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);
```
