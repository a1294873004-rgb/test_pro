import React, { useEffect, useState } from "react";
import {
  Observable,
  of,
  from,
  fromEvent,
  interval,
  timer,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  map,
  filter,
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  take,
  catchError,
  // } from "rxjs";
} from "./libs/rxjs/src"; // 本地调试rxjs源码用

function test() {
  console.log("fuck test rxjs");
  const users$ = of("Alice", "Bob", "Charlie");

  function fetchUserPosts(user: string) {
    return of([`${user}-post1`, `${user}-post2`]); // 模拟 HTTP 返回 observable
  }

  users$
    .pipe(mergeMap((user) => fetchUserPosts(user)))
    .subscribe((posts) => console.log(posts));
}
const RxJsDemo: React.FC = () => {
  useEffect(() => {
    test();
  }, []);

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "1px solid red",
          width: 200,
          height: 200,
        }}
      >
        Rxjs
      </div>
      <div
        style={{
          border: "1px solid green",
          width: 200,
          height: 200,
        }}
      >
        Rxjs
      </div>
    </div>
  );
};

export { RxJsDemo };
