# 订阅(Subscription)

**什么是一个订阅(Subscription)呢?** 一个订阅(Subscription)其实就是一个对象，代表着一个可撤消的资源，通常是指一个可观察者（Observable）对象的执行。 订阅对象（Subscription）有一个重要的方法：`unsubscribe`。它不带参数，只用来释放由当前订阅对象（Subscription）所持有的资源。 在以往的RxJS版本中， 订阅对象（Subscription） 被称为"可消除者（Disposable）"。

```js
var observable = Rx.Observable.interval(1000);
var subscription = observable.subscribe(x => console.log(x));
// Later:
// This cancels the ongoing Observable execution which
// was started by calling subscribe with an Observer.
subscription.unsubscribe(); 
```

<span class="informal">订阅对象(Subscription)实际上只有一个`unsubscribe()`方法用来释放资源或者取消可观察者对象（Observable）的执行。</span>

订阅对象（Subscription）也是可以被放在一起的，从而对一个订阅对象（Subscription）的`unsubscribe()`方法调用一次，就可以取消多个订阅。你可以通过"添加"一个订阅（Subscription）到另一个订阅（Subscription）做到：

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

订阅（Subscription）也有一个`remove(otherSubscription)`的方法，用于撤销子订阅的执行。
