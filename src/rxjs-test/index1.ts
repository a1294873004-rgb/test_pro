import { debounce, isEqual } from "lodash-es";

function onResize() {
  console.log("onResize");
}
const debouncedOnResize = debounce(
  (size: { width: number; height: number }) => {
    console.log("useResizeObserver onResize");
    onResize();
  },
  2000
  // { trailing: true }
);
console.log("running index.ts");
debouncedOnResize({ width: 100, height: 200 });
