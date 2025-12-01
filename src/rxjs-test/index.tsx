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
} from "rxjs";

const RxJsDemo: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    // ----------------- Observable -----------------
    // 核心概念：可被订阅的数据流
    const obs$ = new Observable<number>((subscriber) => {
      subscriber.next(1); // 发射数据
      subscriber.next(2);
      subscriber.next(3);
      subscriber.complete(); // 完成
    });
    obs$.subscribe({
      next: (v) => appendLog(`Observable value: ${v}`),
      complete: () => appendLog("Observable complete"),
    });

    // ----------------- of / from -----------------
    // of: 将参数序列转换为 Observable
    of(10, 20, 30).subscribe((v) => appendLog(`of: ${v}`));
    // from: 将数组、Promise、Iterable 转为 Observable
    from([100, 200, 300]).subscribe((v) => appendLog(`from: ${v}`));

    // ----------------- interval / timer -----------------
    // interval: 每隔指定时间发射递增数字
    const subInterval = interval(1000)
      .pipe(take(3)) // take(3) 表示只取前3个
      .subscribe((v) => appendLog(`interval: ${v}`));

    // timer: 指定延迟后发射一次，或者延迟后重复发射
    timer(2000).subscribe(() => appendLog("timer fired after 2s"));

    // ----------------- fromEvent -----------------
    // 将 DOM 事件转换为 Observable
    const click$ = fromEvent(document, "click");
    const subClick = click$.subscribe(() => appendLog("document clicked"));

    // ----------------- Subject -----------------
    // 可多播的 Observable，可以主动调用 next() 触发
    const subject$ = new Subject<number>();
    subject$.subscribe((v) => appendLog(`Subject subscriber1: ${v}`));
    subject$.subscribe((v) => appendLog(`Subject subscriber2: ${v}`));
    subject$.next(1);
    subject$.next(2);

    // ----------------- BehaviorSubject -----------------
    // 初始化有默认值，订阅时会立即发送最新值
    const behavior$ = new BehaviorSubject<number>(0);
    behavior$.subscribe((v) => appendLog(`BehaviorSubject subscriber1: ${v}`));
    behavior$.next(5);

    // ----------------- ReplaySubject -----------------
    // 缓存指定数量的历史值，订阅时会发送缓存值
    const replay$ = new ReplaySubject<number>(2); // 缓存最近2个值
    replay$.next(1);
    replay$.next(2);
    replay$.next(3);
    replay$.subscribe((v) => appendLog(`ReplaySubject: ${v}`));

    // ----------------- AsyncSubject -----------------
    // 只有当 complete 时，才发射最后一个值
    const async$ = new AsyncSubject<number>();
    async$.subscribe((v) => appendLog(`AsyncSubject: ${v}`));
    async$.next(1);
    async$.next(2);
    async$.next(3);
    async$.complete(); // 订阅者收到 3

    // ----------------- Operators 示例 -----------------
    // map: 映射每个值
    // filter: 过滤值
    // tap: 观察中间值
    const op$ = from([1, 2, 3, 4, 5]).pipe(
      map((v) => v * 2), // 每个值乘2
      filter((v) => v > 5), // 只保留大于5的
      tap((v) => appendLog(`tap: ${v}`)) // 打印中间值
    );
    op$.subscribe((v) => appendLog(`Operators result: ${v}`));

    // debounceTime + distinctUntilChanged + switchMap 示例（搜索输入防抖）
    const search$ = new Subject<string>();
    search$
      .pipe(
        debounceTime(300), // 防抖，等待300ms无变化
        distinctUntilChanged(), // 去重
        switchMap((query) => of(`result for ${query}`)) // 模拟异步请求
      )
      .subscribe((res) => appendLog(res));

    search$.next("a"); // 不会立刻输出
    search$.next("ab"); // 会替换掉前一个
    search$.next("abc"); // 300ms 后输出 'result for abc'

    // ----------------- catchError 示例 -----------------
    const error$ = new Observable<number>((sub) => {
      sub.next(1);
      sub.next(2);
      sub.error(new Error("Something went wrong"));
    }).pipe(
      catchError((err) => {
        appendLog(`catchError: ${err.message}`);
        return of(0); // 错误后返回备用值
      })
    );
    error$.subscribe((v) => appendLog(`catchError value: ${v}`));

    // 清理订阅
    return () => {
      subInterval.unsubscribe();
      subClick.unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>RxJS React + TS Demo</h2>
      <p>点击页面可触发 fromEvent 示例</p>
      <div>
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};

export { RxJsDemo };
