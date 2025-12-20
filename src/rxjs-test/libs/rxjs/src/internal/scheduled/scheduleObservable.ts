import { from } from "src/rxjs-test/libs/observable/src";
import { observeOn } from "../operators/observeOn";
import { subscribeOn } from "../operators/subscribeOn";
import type { InteropObservable, SchedulerLike } from "../types";

export function scheduleObservable<T>(
  input: InteropObservable<T>,
  scheduler: SchedulerLike
) {
  return from(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
