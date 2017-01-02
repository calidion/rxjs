## ES6下通过npm

```none
npm install rxjs-es
```

导入整个核心功能模块：
```js
import Rx from 'rxjs/Rx';

Rx.Observable.of(1,2,3)
```

根据需求分包导入(对打包后体积敏感的项目很有用)：

```js 
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

Observable.of(1,2,3).map(x => x + '!!!'); // etc
```

按需导入并与推荐的[绑定运算子](https://github.com/tc39/proposal-bind-operator)一起使用：

> 注意: 这个附加语法依赖[transpiler支持](http://babeljs.io/docs/plugins/transform-function-bind/) 并且此语法可能会被TC39完全撤销。恕不另行通知!使用风险请自行承担。

```js
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';

Observable::of(1,2,3)::map(x => x + '!!!'); // etc
```

## CommonJS下通过npm

```none
npm install rxjs
```

导入所有的核心功能模块:

```js
var Rx = require('rxjs/Rx');

Rx.Observable.of(1,2,3); // etc
```

按需导入，并将Observable分开使用(这在对打包敏感的场景中很有用):

```js
var Observable = require('rxjs/Observable').Observable;
// patch Observable with appropriate methods
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');

Observable.of(1,2,3).map(function (x) { return x + '!!!'; }); // etc
```

导入运算符并且 _手动_ 使用它们，可以这样做(对打包也很有用):

```js
var of = require('rxjs/observable/of').of;
var map = require('rxjs/operator/map').map;

map.call(of(1,2,3), function (x) { return x + '!!!'; });
```

你可以使用上面的方法来构建你自己的Observable，并从你自己的模块导出。

### CommonJS下使用TypeScript
如果你在使用RxJS时，遇到类似`error TS2304: Cannot find name 'Promise'` 或者 `error TS2304: Cannot find name 'Iterable'` 的错误，
你可能需要安装typings的一个辅助模块。

1. 对于[`typings`](https://github.com/typings/typings) 用户:

    `typings install es6-shim --ambient`

2. 如果你不使用typings，此接口可以从[/es6-shim/es6-shim.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/es6-shim/es6-shim.d.ts)复制。

3. 添加 `tsconfig.json` 或者 CLI 参数中的类型定义文件。

## 所有的模块类型 (CJS/ES6/AMD/TypeScript) 通过npm

通过 [npm](https://www.npmjs.org) **version 3**安装这个库:

```none
npm install @reactivex/rxjs
```

如果你使用 npm **version 2** 之前版本，这个库已经实现了稳定的版本,你需要明确指定库版本:

```none
npm install @reactivex/rxjs@5.0.0-beta.1
```

## CDN

对于CDN, 您可以使用 [unpkg](https://unpkg.com)。只需要用当前版本替换`version`版本下面的链接:

对于 RxJS 5.0.0-beta.1 通过 beta.11:https://unpkg.com/@reactivex/rxjs@version/dist/global/Rx.umd.js

对于 RxJS 5.0.0-beta.12以及更高版本:https://unpkg.com/@reactivex/rxjs@version/dist/global/Rx.js
