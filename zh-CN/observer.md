# 观察者（Observer）

**什么是观察者（Observer）?** 是一个接收可观察者（Observable）对象数据的消费者。可观察者（Observable）对象简单来说是一组回调函数,一个用于接收可观察对象（Observable）发送的`next`, `error`, 和 `complete`通知的对象。 下面是一个很典型的可观察者（Observable）对象的例子：

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```

使用可观察者（Observable）对象时, 只需要将它放到一个可观察者（Observable）对象的subscribe方法中即可：

<!-- skip-example -->
```js
observable.subscribe(observer);
```

<span class="informal">可观察者（Observable）对象仅仅是由三个回调函数组成的对象, 每个回调函数分别对应一种可观察者（Observable）对象的通知类型。</span>

可观察者（Observable）对象在RxJS中也可以是*不完全*的。 如果你没有提供某个回调函数,可观察者（Observable）对象仍然会正常执行, 只是某些类型的通知会被忽略, 因为它们在可观察者（Observable）对象中没有相应的回调函数。

下面的例子是一个没有 `complete` 回调方法的可观察者（Observable）对象：

```js
var observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
};
```

当订阅一个可观察者（Observable）对象时，你也可以只提供回调函数作为参数，而不用传入一个可观察者（Observable）对象。比如这样：

<!-- skip-example -->
```js
observable.subscribe(x => console.log('Observer got a next value: ' + x));
```

这时在`observable.subscribe`方法内部，它会创建一个可观察者（Observable）对象，并将第一个参数作为next的处理函数。而三种类型的回调函数都可以以参数形式传入：

<!-- skip-example -->
```js
observable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);
```
