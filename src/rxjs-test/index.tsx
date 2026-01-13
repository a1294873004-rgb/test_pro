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
  combineLatest,
  ReplaySubject,
  AsyncSubject,
  map,
  filter,
  tap,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  skip,
  take,
  defer,
  exhaustMap,
  throttle,
  finalize,
  catchError,
  // } from "rxjs";
} from "./libs/rxjs/src"; // 本地调试rxjs源码用

const _getQueryKey = (
  idOrOptions: string | { readonly?: boolean; query?: any }
) => {
  if (typeof idOrOptions === "string") {
    return idOrOptions;
  }
  const { readonly, query } = idOrOptions;
  const readonlyKey = _getReadonlyKey(readonly);
  const key = JSON.stringify({
    readonlyKey,
    query,
  });
  return key;
};

function _getReadonlyKey(readonly?: boolean): "true" | "false" {
  return (readonly?.toString() as "true" | "false") ?? "false";
}

function test() {
  const str = _getQueryKey({
    readonly: false,
  });
  console.log("fuck test rxjs", str);
  const users$ = of("Alice");

  function fetchUserPosts(user: string) {
    return of([`${user}-post1`, `${user}-post2`]); // 模拟 HTTP 返回 observable
  }

  // users$
  //   // .pipe(mergeMap((user) => fetchUserPosts(user)))
  //   .pipe(
  //     tap((result) => {
  //       console.log("res", result);
  //     }),
  //     onStart(() => {}),
  //     onComplete(() => {})
  //   )
  //   .subscribe((posts) => console.log(posts));
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
