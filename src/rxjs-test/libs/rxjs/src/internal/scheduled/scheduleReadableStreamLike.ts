import type { SchedulerLike, ReadableStreamLike } from "../types";
import type { Observable } from "src/rxjs-test/libs/observable/src";
import { readableStreamLikeToAsyncGenerator } from "src/rxjs-test/libs/observable/src";
import { scheduleAsyncIterable } from "./scheduleAsyncIterable";

export function scheduleReadableStreamLike<T>(
  input: ReadableStreamLike<T>,
  scheduler: SchedulerLike
): Observable<T> {
  return scheduleAsyncIterable(
    readableStreamLikeToAsyncGenerator(input),
    scheduler
  );
}
