# 观察者（Observer）

**那么什么是观察者（Observer）呢?** 其实它只是一个接收可观察者（Observable）数据的消费者。观察者（Observer）简单来说就是一组回调函数,是一个用于接收可观察对象（Observable）发送的`next`, `error`, 和 `complete`等通知的对象。 下面是一个很典型的观察者（Observer）的例子：

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```

使用观察者（Observer）对象时, 只需要将它放到一个可观察者（Observable）对象的subscribe方法中即可：

<!-- skip-example -->
```js
observable.subscribe(observer);
```

<span class="informal">观察者（Observable）只是由三个回调函数组成的对象, 而每个回调函数分别对应一种可观察者（Observable）的通知类型。</span>

观察者（Observer）在RxJS中也可以是*不完全*的。 如果你没有提供某个类型的回调函数,可观察者（Observable）仍然会正常执行, 只是某些类型的通知会被忽略, 因为它们在观察者（Observer）中没有相应的回调函数。

下面的例子是一个没有 `complete` 回调方法的观察者（Observer）：

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
};
```

当订阅一个可观察者（Observable）对象时，你也可以只提供回调函数作为参数，而不用传入一个观察者（Observer）对象。比如这样：

<!-- skip-example -->
```js
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```

这时在`observable.subscribe`方法内部，它会创建一个可观察者（Observer）对象，并将第一个参数作为next的处理函数。而三种类型的回调函数都可以以参数形式传入：

<!-- skip-example -->
```js
observable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);
```
