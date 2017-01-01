## ES6 通过npm

```none
npm install rxjs-es
```

导入整个核心功能模块
```js
import Rx from 'rxjs/Rx';

Rx.Observable.of(1,2,3)
```

仅作为补充部分导入你所需要的模块 (通常这种做法有利于于减少项目构建后的文件大小):

```js 
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

Observable.of(1,2,3).map(x => x + '!!!'); // etc
```

导入您需要的并且与提出的[绑定操作符](https://github.com/tc39/proposal-bind-operator)一起使用它:

> 注意: 这个附加语法依赖[transpiler 支持](http://babeljs.io/docs/plugins/transform-function-bind/) 并且此语法可能
会完全撤销TC39 恕不另行通知! 使用风险请自行承担.

```js
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';

Observable::of(1,2,3)::map(x => x + '!!!'); // etc
```

## CommonJS 通过npm安装

```none
npm install rxjs
```

导入所有的核心功能模块:

```js
var Rx = require('rxjs/Rx');

Rx.Observable.of(1,2,3); // etc
```

导入您需要的并且为Observable 打补丁(这在对文件大小很敏感的打包场景中很有用):

```js
var Observable = require('rxjs/Observable').Observable;
// patch Observable with appropriate methods
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');

Observable.of(1,2,3).map(function (x) { return x + '!!!'; }); // etc
```

导入运算符并且 _手动_ 使用它们，您可以执行以下操作(这对打包构建也很有用):

```js
var of = require('rxjs/observable/of').of;
var map = require('rxjs/operator/map').map;

map.call(of(1,2,3), function (x) { return x + '!!!'; });
```

你可以使用上面的方法来构建你自己的Observable并从你自己的模块导出。.

### CommonJS 与 TypeScript
如果你遇到一个错误，如 `error TS2304: Cannot find name 'Promise'` 或者 `error TS2304: Cannot find name 'Iterable'` 当使用RxJS 时，你可能需要通过typings安装补丁.

1. 对于[`typings`](https://github.com/typings/typings) 用户:

    `typings install es6-shim --ambient`

2.如果你不使用typings 此接口可以从[/es6-shim/es6-shim.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/es6-shim/es6-shim.d.ts)复制.

3. 添加 `tsconfig.json` 或者 CLI 参数中包含的类型定义文件.

## 所有的模块类型 (CJS/ES6/AMD/TypeScript) 通过npm

安装这个库通过 [npm](https://www.npmjs.org) **version 3**, 使用下面的命令:

```none
npm install @reactivex/rxjs
```

如果你使用 npm **version 2** 之前版本，这个库已经实现了稳定的版本,你需要明确指定库版本:

```none
npm install @reactivex/rxjs@5.0.0-beta.1
```

## CDN

对于CDN, 您可以使用 [unpkg](https://unpkg.com). 只需要用当前版本替换`version`版本下面的链接:

对于 RxJS 5.0.0-beta.1 通过 beta.11:https://unpkg.com/@reactivex/rxjs@version/dist/global/Rx.umd.js

对于 RxJS 5.0.0-beta.12以及更高版本:https://unpkg.com/@reactivex/rxjs@version/dist/global/Rx.js
