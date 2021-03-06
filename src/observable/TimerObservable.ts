import { isNumeric } from '../util/isNumeric';
import { Scheduler } from '../Scheduler';
import { Observable } from '../Observable';
import { async } from '../scheduler/async';
import { isScheduler } from '../util/isScheduler';
import { isDate } from '../util/isDate';
import { TeardownLogic } from '../Subscription';
import { Subscriber } from '../Subscriber';

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class TimerObservable extends Observable<number> {

  /**
   * Creates an Observable that starts emitting after an `initialDelay` and
   * emits ever increasing numbers after each `period` of time thereafter.
   *
   * <span class="informal">Its like {@link interval}, but you can specify when
   * should the emissions start.</span>
   *
   * <img src="./img/timer.png" width="100%">
   *
   * `timer` returns an Observable that emits an infinite sequence of ascending
   * integers, with a constant interval of time, `period` of your choosing
   * between those emissions. The first emission happens after the specified
   * `initialDelay`. The initial delay may be a {@link Date}. By default, this
   * operator uses the `async` Scheduler to provide a notion of time, but you
   * may pass any Scheduler to it. If `period` is not specified, the output
   * Observable emits only one value, `0`. Otherwise, it emits an infinite
   * sequence.
   *
   * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
   * var numbers = Rx.Observable.timer(3000, 1000);
   * numbers.subscribe(x => console.log(x));
   *
   * @example <caption>Emits one number after five seconds</caption>
   * var numbers = Rx.Observable.timer(5000);
   * numbers.subscribe(x => console.log(x));
   *
   * @see {@link interval}
   * @see {@link delay}
   *
   * @param {number|Date} initialDelay The initial delay time to wait before
   * emitting the first value of `0`.
   * @param {number} [period] The period of time between emissions of the
   * subsequent numbers.
   * @param {Scheduler} [scheduler=async] The Scheduler to use for scheduling
   * the emission of values, and providing a notion of "time".
   * @return {Observable} An Observable that emits a `0` after the
   * `initialDelay` and ever increasing numbers after each `period` of time
   * thereafter.
   * @static true
   * @name timer
   * @owner Observable
   */
  static create(initialDelay: number | Date = 0,
                period?: number | Scheduler,
                scheduler?: Scheduler): Observable<number> {
    return new TimerObservable(initialDelay, period, scheduler);
  }

  static dispatch(state: any) {

    const { index, period, subscriber } = state;
    const action = (<any> this);

    subscriber.next(index);

    if (subscriber.closed) {
      return;
    } else if (period === -1) {
      return subscriber.complete();
    }

    state.index = index + 1;
    action.schedule(state, period);
  }

  private period: number = -1;
  private dueTime: number = 0;
  private scheduler: Scheduler;

  constructor(dueTime: number | Date = 0,
              period?: number | Scheduler,
              scheduler?: Scheduler) {
    super();

    if (isNumeric(period)) {
      this.period = Number(period) < 1 && 1 || Number(period);
    } else if (isScheduler(period)) {
      scheduler = <Scheduler> period;
    }

    if (!isScheduler(scheduler)) {
      scheduler = async;
    }

    this.scheduler = scheduler;
    this.dueTime = isDate(dueTime) ?
      (+dueTime - this.scheduler.now()) :
      (<number> dueTime);
  }

  protected _subscribe(subscriber: Subscriber<number>): TeardownLogic {
    const index = 0;
    const { period, dueTime, scheduler } = this;

    return scheduler.schedule(TimerObservable.dispatch, dueTime, {
      index, period, subscriber
    });
  }
}
