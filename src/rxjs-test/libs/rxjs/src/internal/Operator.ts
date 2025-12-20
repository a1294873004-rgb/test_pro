import type { Subscriber } from "src/rxjs-test/libs/observable/src";
import type { TeardownLogic } from "./types";

/***
 * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
 */
export interface Operator<T, R> {
  call(subscriber: Subscriber<R>, source: any): TeardownLogic;
}
