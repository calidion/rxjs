# 可观察对象(Observable)

可观察对象(Observable)们是一种对多次值的非即时推送技术。他们将下面的表格填补完成了。

| | 单次数值(Single) | 多次数值(Multiple) |
| --- | --- | --- |
| **Pull** | [`Function`](https://developer.mozilla.org/en-US/docs/Glossary/Function) | [Iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) |
| **Push** | [`Promise`](https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise) | **[`Observable`](../class/es6/Observable.js~Observable.html)** |

> 译者注：如果没有Observable那么，右下角是一个空白区域。所以理论还是很重要的:)

**示例**

下面是一个可观察对象(Observable)在被订阅后，将`1`, `2`, `3`立即（同步）推送出去，而1秒钟后再传入`4`，并且结束的代码：


```js
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});
```

为了对这个可观察对象(Observable)进行调用，我们需要*订阅(subscribe)*它。

```js
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 1000);
});

console.log('just before subscribe');
observable.subscribe({
  next: x => console.log('got value ' + x),
  error: err => console.error('something wrong occurred: ' + err),
  complete: () => console.log('done'),
});
console.log('just after subscribe');
```

在`console`执行的效果是这样的：

```none
just before subscribe
got value 1
got value 2
got value 3
just after subscribe
got value 4
done
```

## Pull VS Push

*Pull*和*Push*是两个不同的协议，但是它们都是关于一个数据的*生产者*与数据的*消费者*如何通讯的协议。

**Pull是什么？**

在Pull的系统里，消费者决定什么时候接收生产者的数据。而生产者自身并不关心数据什么时候发送给消费者。

所有的JavaScript函数都是一个Pull系统。函数是一个数据的生产者，而代码调用函数其实就是一个通过调用来"Pull"出一个*单个* 数据的消费过程。

ES2015引入了[生成器(generator)函数和迭代器(iterator)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)(`function*`),另一个Pull系统。调用`iterator.next()`的代码其实就是消费者，从迭代器（生产者）中"Pull"出一个*多个*数值。


**Push是什么？**

在Push的系统里，生产者决定什么时候发送数据给消息者。而消费者自身并不关心数据什么时候发送过来。

许诺器(Promise)是现在JavaScript里最常见的Push类型。一个许诺器(Promise)(生产者)发送一个解决的结果给注册的回调函数（消费者）。但是与函数不同的是，许诺器（Promies）决定着什么时候将数据”Push"到回调函数。


| | 生产者（Producer） | 消费者（Consumer） |
| --- | --- | --- |
| **Pull** | **被动（Passive）:** 请求是生成数据。 | **主动（Active）:** 决定数据什么时候请求。 |
| **Push** | **主动（Active）:** 按自己的节奏生成数据。 | **被动（Passive）:** 对接收到的数据作出反应。 |


RxJS引入了可观察对象(Observable)，一个新的JavaScript上的Push系统。一个可观察对象(Observable)是一个多值的生产者，然后能将多值同时推送给观察者(Observer)(Consumers)。

- 一个**函数（Function）**是一个懒运算，它在调用后同步返回一个值。
- 一个**生成器（generator）**是一个懒运算，它通过迭代可以返回0次或者无限（理论上）个值。
- 一个**许诺器(Promise)**是一个运算，它可能会（也可能不会）最终返回一个值。
- 一个**可观察者（Observable）**是一个懒运算，它可以同步，也可以异步的返回0次或者无限（理论上）个值，而值的产生方式是由对它的调用产生。

> 懒运算(lazy computation)，是指被动调用的一种运算，即Call-by-value，当有数据需求时再调用。
> 急运算(eager evaluation), 是指不管是不是能处理都会被调用，即Call-by-need。

## 可观察者（Observable）是一种对函数的泛化

与流行的说法不同的时，可观察者（Observable）即不是多值化的EventEmitter也不是多值化的许诺器(Promise)。可观察者（Observable）在一些场景，比如在使用RxJS的Subject对象并且被多播（multicast）时，*可能行为上*有点象是EventEmitter，，但是通常它们并不象EventEmmiter。

<span class="informal">可观察者（Observable）象是没有参数的函数，但是将参数泛化并允许多个参数。 </span>

可以看下下面的代码：

```js
function foo() {
  console.log('Hello');
  return 42;
}

var x = foo.call(); // same as foo()
console.log(x);
var y = foo.call(); // same as foo()
console.log(y);
```

我们可以看到预期的输出：

```none
"Hello"
42
"Hello"
42
```

我们也可以用可观察者（Observable）写出与上面结果完全相同的代码：

```js
var foo = Rx.Observable.create(function (observer) {
  console.log('Hello');
  observer.next(42);
});

foo.subscribe(function (x) {
  console.log(x);
});
foo.subscribe(function (y) {
  console.log(y);
});
```

结果完全相同：
```none
"Hello"
42
"Hello"
42
```

这种情况发生的原因是因为函数与可观察者（Observable）都是懒运算。如果你不调用函数，`console.log('Hello')`就不会发生。而对于可观察者（Observable）来说，如果你不"调用"(通过`subscribe`)它，`console.log('Hello')`也不会发生。还有“调用”或者“订阅”是一种隔离的操作：两个函数函数调用触发两个不同的影响，而两个不同的可观察者（Observable）订阅触发另外两个不同的影响。而EventEmitter刚好相反，它是分享影响的，并且是一种急(Eager)执行，它并不关心是不是有订阅者（即任何时候都会广播)。而可观察者（Observable）并不会分享执行，因为他们是懒的。

<span class="informal">订阅可观察者（Observable）与调用一个函数是类似的。</span>

有些人认为可观察者（Observable）是异步的。但是并不对。如果你在一个函数调用前后围上log，象这样：

<!-- skip-example -->
```js
console.log('before');
console.log(foo.call());
console.log('after');
```

你会看到这样的结果：

```none
"before"
"Hello"
42
"after"
```

而这与可观察者（Observable）的行为完全一样：

<!-- skip-example -->
```js
console.log('before');
foo.subscribe(function (x) {
  console.log(x);
});
console.log('after');
```

输出结果:

```none
"before"
"Hello"
42
"after"
```

这证明了订阅`foo`是完全同步的，就象是一个函数。

<span class="informal">可观察者（Observable）即可以同步，也可以异步对数据进行推送。</span>

那么可观察者（Observable）与函数有什么不同呢？ **可观察者（Observable）可以"返回"多个值在不同的时间点上**，这是函数无法做到的。你无法这样做：

```js
function foo() {
  console.log('Hello');
  return 42;
  return 100; // 死的代码，永远不会被执行
}
```

函数只能返回一个值。可观察者（Observable）却可以这样做：

```js
var foo = Rx.Observable.create(function (observer) {
  console.log('Hello');
  observer.next(42);
  observer.next(100); // "return" another value
  observer.next(200); // "return" yet another
});

console.log('before');
foo.subscribe(function (x) {
  console.log(x);
});
console.log('after');
```

同步输出的结果：

```none
"before"
"Hello"
42
100
200
"after"
```

但是你也可以异步的返回值：

```js
var foo = Rx.Observable.create(function (observer) {
  console.log('Hello');
  observer.next(42);
  observer.next(100);
  observer.next(200);
  setTimeout(() => {
    observer.next(300); // happens asynchronously
  }, 1000);
});

console.log('before');
foo.subscribe(function (x) {
  console.log(x);
});
console.log('after');
```

结果是：

```none
"before"
"Hello"
42
100
200
"after"
300
```

结论:

- `func.call()` 表示 "*同步地给我一个值*"
- `observable.subscribe()` 表示 "*给我任意个值，不管是同步还是异步*"

## 可观察者（Observable）剖析

可观察者（Observable）使用`Rx.Observable.create`或者创建型运算子**创建**，可被一个观察者（Observer）**订阅**，然后**执行**推送`next` / `error` / `complete`等通知给观察者（Observer），并且它们的执行是可以被**消除**的。这四个功能已经在一个可观察者（Observable）实例中编码完全，但是仍有一些功能与其它的类型有关系，比如观察者（Observer）和订阅（Subscription）。


可观察者（Observable）关注的核心点：
- **创建**可观察者（Observable）
- **订阅**可观察者（Observable）
- **执行**可观察者（Observable）
- **消除**可观察者（Observable）

### 创建可观察者（Observable）

`Rx.Observable.create`是`Observable`构建器(Constructor)的别名，它只接收一个参数：`subscribe`函数。

下面的例子创建一个可观察者（Observable），然后每秒都发送字符`'hi'`给一个观察者（Observer）。

```js
var observable = Rx.Observable.create(function subscribe(observer) {
  var id = setInterval(() => {
    observer.next('hi')
  }, 1000);
});
```

<span class="informal">可观察者（Observable）可以通过`create`创建，但是通常我们使用所谓的［创建型运算子］(./overview.html#creation-operators)，象 `of`，`from`，`interval`等。</span>

在上面的例子里，`subscribe`函数是描述可观察者（Observable）最重要的部分。所以下面我们一起来看看订阅到底是什么。


### 订阅可观察者（Observable）

上面例子中的可观察者（Observable）变量`observable`可以这样被*订阅*：

<!-- skip-example -->
```js
observable.subscribe(x => console.log(x));
```
`observable.subscribe`和在`Observable.create(function subscribe(observer) {...})`里的`subscribe`使用同一个名字不是一个巧合。对于库来说，它们是不同的；但是对于实际的目的来说，你可以认为它们在概念上是相同的。

这也展示了一个可观察者（Observable）的`subscribe`调用并不会在它的多个观察者（Observer）中分享。当通过一个观察者（Observer）调用`observable.subscribe`时，`Observable.create(function subscribe(observer) {...})`里的`subscribe`只会调用这个给定的观察者（Observer）。每次调用`observable.subscribe`都只会触发给定观察者（Observer）自己独立的设置。



<span class="informal">订阅一个可观察者（Observable）就象是一次函数调用，只不过提供的回调函数是数据会被推送过去的地方。</span>

这与象`addEventListener` / `removeEventListener`这样事件处理的API是非常不同的。通过使用`observable.subscribe`，给定的观察者（Observer）并没有注册成为可观察者（Observable）的一个侦听者（listener）。而可观察者（Observable）更是连一个相关的观察者（Observer）列表都没有。

一个`subscribe`调用只是一个启动一次”可观察者（Observable）执行“的方法，然后发送值或者事件到这个执行的一个观察者（Observer）那里。


### 执行可观察者（Observable）

在`Observable.create(function subscribe(observer) {...})`里的代码代表了一次“可观察者（Observable）执行”，一个懒计算只会在每个观察者（Observer）执行订阅时发生。这个执行随着时间的推移可以产生多个值，可以是同步也可以异步。

一个可观察者执行（Observable Execution）有三个类型可以推送：

- "Next"通知: 发送一个值：包括一个数，一个字符串，一个对象等。
- "Error"通知: 发送一个JavaScript的Error或者异常。
- "Complete"通知:　不发送值。

Next通知是最重要也是最常见的类型：它们表示实际的数据被发送给观察者（Observer）。
Error和Complete通知只会在可观察者执行（Observable Execution）过程中出现一次，并且两者不会同时出现。

这个约束可以通过可观察者（Observable） *语法（Grammar）*或者*契约（Contract）*很好的描述，它是一个如下的正则：

```none
next*(error|complete)?
```

<span class="informal">在一个可观察者执行（Observable Execution）中，0个或者无限个Next通知会被发送。但是如果一个Error或者Complete通知被发送，那么之后就不会有任何东西被发送出来了。</span>

下面是一个可观察者执行（Observable Execution）发送三次Next通知然后Complete的例子：

```js
var observable = Rx.Observable.create(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});
```


可观察者（Observable）严格的遵守可观察者契约（Observable Contract），所以下面的代码中的Next通知`4`不会被发送。

```js
var observable = Rx.Observable.create(function subscribe(observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next(4); // 由于不符合契约，所以不会被发送。
});
```

如果需要在`subscribe`函数里捕获错误，并发送Error消息，那把代码用`try`/`catch`包装起来应该是一个好的思路。

```js
var observable = Rx.Observable.create(function subscribe(observer) {
  try {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
  } catch (err) {
    observer.error(err); // 发送错误，如果能捕获的话
  }
});
```

### 消除可观察者执行（Observable Execution）

由于可观察者执行（Observable Execution）可能是无限的，一个观察者（Observer）想要在有限的时间内退出执行是很正常的事情，所以我们需要一个API用来取消执行。因为每个执行都是只对一个观察者（Observer）负责的，一旦这个观察者（Observer）完成数据接收，那么它必须要有一个方法来结束这个执行，从而避免浪费计算能力和内存资源。


当`observable.subscribe`被调用时，那么这个观察者（Observer）就与这个新创建的可观察者执行（Observable Execution）关联上了，同时这个调用会返回一个对象：`Subscription`：

<!-- skip-example -->
```js
var subscription = observable.subscribe(x => console.log(x));
```

这个`Subscription`对象代表着正在进行的执行，并且有最基本的用于取消这个执行的API。了解更多关于[`Subscription`类型](./overview.html#subscription)。使用`subscription.unsubscribe()`你就可以取消正在当前的执行。

```js
var observable = Rx.Observable.from([10, 20, 30]);
var subscription = observable.subscribe(x => console.log(x));
// Later:
subscription.unsubscribe();
```


<span class="informal">当你订阅时，你会得到一个Subscription对象，这个对象代表着当前的执行。但需要调用`unsubscribe()`就可以取消这个执行。 </span>

当我们通过`create()`创建一个可观察者（Observable）时，每个可观察者（Observable）都必须定义如何消除这个执行所拥有的资源。你可以在`函数 subscribe()`里返回一个函数作为自定义的`unsubscribe`函数，用于消除相关的资源。

比如，下面的代码说明了我们清除一个由`setInterval`设定的定期执行的方法。

For instance, this is how we clear an interval execution set with `setInterval`:

```js
var observable = Rx.Observable.create(function subscribe(observer) {
  // Keep track of the interval resource
  var intervalID = setInterval(() => {
    observer.next('hi');
  }, 1000);

  // Provide a way of canceling and disposing the interval resource
  return function unsubscribe() {
    clearInterval(intervalID);
  };
});
```

就象`observable.subscribe`与`Observable.create(function subscribe() {...})`很象一样，我们从`subscribe`返回的`unsubscribe`在概念上也与`subscription.unsubscribe`是一样的。如果我们将附加的ReactivX的类型从这些概念上去除，我们就可以得到更加直接的JavaScript代码。

```js
function subscribe(observer) {
  var intervalID = setInterval(() => {
    observer.next('hi');
  }, 1000);

  return function unsubscribe() {
    clearInterval(intervalID);
  };
}

var unsubscribe = subscribe({next: (x) => console.log(x)});

// Later:
unsubscribe(); // dispose the resources
```

而我们使用象Observable，Observer和Subscription这些Rx类型的原因是为了获得安全性（比如可观察者契约（Observable Contract））和让运算子可消除。
