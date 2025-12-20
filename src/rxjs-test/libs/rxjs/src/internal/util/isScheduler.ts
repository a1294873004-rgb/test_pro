import type { SchedulerLike } from "../types";
import { isFunction } from "src/rxjs-test/libs/observable/src";

export function isScheduler(value: any): value is SchedulerLike {
  return value && isFunction(value.schedule);
}
