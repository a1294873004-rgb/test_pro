import type { PartialObserver, ObservableNotification } from "./types";

export function observeNotification<T>(
  notification: ObservableNotification<T>,
  observer: PartialObserver<T>
) {
  const { kind, value, error } = notification as any;
  if (typeof kind !== "string") {
    throw new TypeError('Invalid notification, missing "kind"');
  }
  kind === "N"
    ? observer.next?.(value!)
    : kind === "E"
      ? observer.error?.(error)
      : observer.complete?.();
}
