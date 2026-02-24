const canvas = document.querySelector("canvas");
const dataURL = canvas.toDataURL("image/png"); // 得到 base64
// 或者
canvas.toBlob((blob) => {
  const url = URL.createObjectURL(blob);
  // 可以创建 <a> 下载
});
(() => {
  const c = document.querySelector("canvas");
  c.toBlob((b) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "canvas.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
})();
