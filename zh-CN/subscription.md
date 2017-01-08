# 订阅(Subscription)

**什么是订阅?** 订阅是一个表示可支配资源的对象, 通常表示一个可观察者对象的执行。 订阅对象有一个重要的方法, `unsubscribe`,不带参数，只是释放资源所持有的订阅。 在以往的RxJS版本中, Subscription 被称为 "Disposable"。

```js
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));
// Later:
// This cancels the ongoing Observable execution which
// was started by calling subscribe with an Observer.
subscription.unsubscribe(); 
```

<span class="informal">订阅基本上只有一个`unsubscribe()`方法用来释放或者取消可观察者对象的执行。</span>

订阅也可以放在一起，因此调用一个订阅的`unsubscribe()`方法，可以取消多个订阅。你可以通过"添加"一个订阅到另一个：


```js
var observable1 = Rx.Observable.interval(400);
var observable2 = Rx.Observable.interval(300);

var subscription = observable1.subscribe(x => console.log('first: ' + x));
var childSubscription = observable2.subscribe(x => console.log('second: ' + x));

subscription.add(childSubscription);

setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe();
}, 1000);
```

执行之后，我们在控制台得到：

```none
second: 0
first: 0
second: 1
first: 1
second: 2
```

订阅也有一个`remove(其他订阅)`的方法，以便撤销自订阅。
