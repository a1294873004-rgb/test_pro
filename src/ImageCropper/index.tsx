import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import styles from "./index.module.less";
interface CropperProps {
  source: File | string;
  containerSize: { width: number; height: number };
  aspectRatios: { label: string; value: number }[];
  maxScale?: number;
  onComplete: (blob: Blob) => void;
}
interface Size {
  width: number;
  height: number;
}

interface AffineMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

interface CropBoxProps {
  ratio: number; // width / height
  parentSize: Size;
  onWheel?: (e: WheelEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
}
interface DragState {
  dragging: boolean;
  lastX: number;
  lastY: number;
}
function canUseOffscreenCanvas(): boolean {
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof OffscreenCanvas.prototype.getContext === "function"
  );
}
type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;

function createCanvas(width: number, height: number): AnyCanvas {
  if (canUseOffscreenCanvas()) {
    return new OffscreenCanvas(width, height);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
async function canvasToBlob(
  canvas: AnyCanvas,
  type = "image/png",
  quality = 0.92,
): Promise<Blob> {
  // OffscreenCanvas
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type, quality });
  }

  // HTMLCanvas
  return new Promise((resolve) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => resolve(blob!),
      type,
      quality,
    );
  });
}
async function exportCroppedImage(
  img: CanvasImageSource, // HTMLImageElement | ImageBitmap
  matrix: AffineMatrix,
  wrapperSize: { width: number; height: number },
  ratio: number,
  options?: {
    background?: string;
    dpr?: number;
    mimeType?: string;
    quality?: number;
  },
): Promise<Blob> {
  const {
    background = "transparent",
    dpr = window.devicePixelRatio || 1,
    mimeType = "image/png",
    quality = 0.92,
  } = options || {};

  /**
   * 1️⃣ CropBox（CSS px）
   */
  let cropW: number;
  let cropH: number;

  if (ratio >= 1) {
    cropW = wrapperSize.width;
    cropH = cropW / ratio;
  } else {
    cropH = wrapperSize.height;
    cropW = cropH * ratio;
  }

  const cropX = (wrapperSize.width - cropW) / 2;
  const cropY = (wrapperSize.height - cropH) / 2;

  /**
   * 2️⃣ Canvas
   */
  const canvas = createCanvas(Math.round(cropW * dpr), Math.round(cropH * dpr));

  const ctx = canvas.getContext("2d")! as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (background !== "transparent") {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, cropW, cropH);
  }

  /**
   * 3️⃣ 对齐 CropBox
   */
  ctx.translate(-cropX, -cropY);

  /**
   * 4️⃣ 应用图片矩阵
   */
  ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);

  /**
   * 5️⃣ 绘制
   */
  ctx.drawImage(img, 0, 0);

  /**
   * 6️⃣ 导出
   */
  return canvasToBlob(canvas, mimeType, quality);
}
const CropBox: React.FC<CropBoxProps> = ({
  ratio,
  parentSize,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  const { width: parentW, height: parentH } = parentSize;

  // 防御：避免除 0
  if (parentW <= 0 || parentH <= 0 || ratio <= 0) {
    return null;
  }

  let width: number;
  let height: number;

  if (parentW / parentH > ratio) {
    // parent 更宽，高度顶满
    height = parentH;
    width = parentH * ratio;
  } else {
    // parent 更窄，宽度顶满
    width = parentW;
    height = parentW / ratio;
  }

  return (
    <div
      onWheel={(e) => {
        e.preventDefault(); // ❗禁止滚动外层
        onWheel?.(e);
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      onMouseMove={(e) => {
        onMouseMove?.(e);
      }}
      onMouseUp={(e) => {
        onMouseUp?.(e);
      }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width,
        height,
        border: "2px solid #fff",
        outline: "2000px solid rgba(0,0,0,.5)",
        // pointerEvents: "none",
        boxSizing: "border-box",
      }}
    />
  );
};
function getCropBoxSize(parentSize: Size, ratio: number): Size {
  const parentRatio = parentSize.width / parentSize.height;

  if (ratio >= parentRatio) {
    // 宽贴满
    const width = parentSize.width;
    const height = width / ratio;
    return { width, height };
  } else {
    // 高贴满
    const height = parentSize.height;
    const width = height * ratio;
    return { width, height };
  }
}
function getCropBoxBounds(parentSize: Size, cropSize: Size) {
  const x = (parentSize.width - cropSize.width) / 2;
  const y = (parentSize.height - cropSize.height) / 2;

  return {
    left: x,
    top: y,
    right: x + cropSize.width,
    bottom: y + cropSize.height,
  };
}

function clipItemMatrix(
  matrix: AffineMatrix,
  imageSize: Size,
  parentSize: Size,
  ratio: number,
): AffineMatrix {
  const { width: imgW, height: imgH } = imageSize;

  console.log("ratio", ratio);
  // 1️⃣ CropBox
  const cropSize = getCropBoxSize(parentSize, ratio);
  const cropBounds = getCropBoxBounds(parentSize, cropSize);

  // 2️⃣ 当前 scale（允许未来扩展旋转）
  let s = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);

  // 3️⃣ 最小 scale：确保 image 覆盖 CropBox
  const minScale = Math.max(cropSize.width / imgW, cropSize.height / imgH);

  if (s < minScale) {
    s = minScale;
  }

  // 4️⃣ image 在 parent 中的 visual bounds
  const visualW = imgW * s;
  const visualH = imgH * s;

  let tx = matrix.tx;
  let ty = matrix.ty;

  const imgBounds = {
    left: tx,
    top: ty,
    right: tx + visualW,
    bottom: ty + visualH,
  };

  // 5️⃣ Clamp（以 CropBox 为准）
  if (imgBounds.left > cropBounds.left) {
    tx -= imgBounds.left - cropBounds.left;
  }
  if (imgBounds.right < cropBounds.right) {
    tx += cropBounds.right - imgBounds.right;
  }

  if (imgBounds.top > cropBounds.top) {
    ty -= imgBounds.top - cropBounds.top;
  }
  if (imgBounds.bottom < cropBounds.bottom) {
    ty += cropBounds.bottom - imgBounds.bottom;
  }

  // 6️⃣ 返回矩阵（当前不保留旋转）
  return {
    a: s,
    b: 0,
    c: 0,
    d: s,
    tx,
    ty,
  };
}
/**
 * 约束矩阵，确保 Item 在 Parent 容器内等比填满且不留白边
 * @param matrix - 原始变换矩阵
 * @param itemSize - Item 的原始尺寸 (w, h)
 * @param parentSize - Parent 容器的尺寸 (w, h)
 */
function clipItemMatrix1(
  matrix: AffineMatrix,
  itemSize: Size,
  parentSize: Size,
): AffineMatrix {
  const { width: itemW, height: itemH } = itemSize;
  const { width: parentW, height: parentH } = parentSize;

  // 1. 提取当前缩放比例 (基于基向量长度，支持包含旋转的缩放提取)
  let s = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);

  // 2. 约束缩放：确保 visualW >= parentW 且 visualH >= parentH
  // 也就是 s 必须大于等于能够覆盖容器的最小缩放因子
  const minScale = Math.max(parentW / itemW, parentH / itemH);
  if (s < minScale) {
    s = minScale;
  }

  // 3. 计算缩放后的实际渲染尺寸 (Visual Size)
  const visualW = itemW * s;
  const visualH = itemH * s;

  // 4. 获取当前的偏移值 (tx, ty)
  let tx = matrix.tx;
  let ty = matrix.ty;

  // 5. 边界约束 (Clamp)
  // 逻辑：left <= 0 (不露左底) 且 left + width >= parentWidth (不露右底)

  // 水平方向修正
  if (tx > 0) {
    tx = 0;
  } else if (tx + visualW < parentW) {
    tx = parentW - visualW;
  }

  // 垂直方向修正
  if (ty > 0) {
    ty = 0;
  } else if (ty + visualH < parentH) {
    ty = parentH - visualH;
  }

  // 6. 返回修正后的矩阵
  // 假设无旋转，直接应用新的 s 和平移点
  return {
    a: s,
    b: 0,
    c: 0,
    d: s,
    tx: tx,
    ty: ty,
  };
}
/**
 * 处理滚轮缩放
 * @param event - WheelEvent
 * @param preMatrix - 当前矩阵 (状态快照)
 * @param parentRect - Parent DOM 的 getBoundingClientRect()，用于将 client 坐标转为相对坐标
 */
function handleWheelZoom(
  event: WheelEvent,
  preMatrix: AffineMatrix,
  parentRect: DOMRect,
): AffineMatrix {
  // 1. 计算缩放增量 (这里可以根据需要调整缩放灵敏度)
  const zoomIntensity = 0.1;
  const delta = event.deltaY > 0 ? 1 - zoomIntensity : 1 + zoomIntensity;

  const sPre = preMatrix.a;
  const sNext = sPre * delta;

  // 2. 获取鼠标相对于 Parent 的坐标 (mx, my)
  const mx = event.clientX - parentRect.left;
  const my = event.clientY - parentRect.top;

  // 3. 计算以鼠标为中心的平移补偿
  // 公式: tx_next = mx - (mx - tx_pre) * (s_next / s_pre)
  const ratio = sNext / sPre;
  const txNext = mx - (mx - preMatrix.tx) * ratio;
  const tyNext = my - (my - preMatrix.ty) * ratio;

  return {
    a: sNext,
    b: 0,
    c: 0,
    d: sNext,
    tx: txNext,
    ty: tyNext,
  };
}
/**
 * 处理拖拽位移
 * @param deltaX - 鼠标移动的 x 差值
 * @param deltaY - 鼠标移动的 y 差值
 * @param preMatrix - 当前矩阵
 */
function handleDrag(
  deltaX: number,
  deltaY: number,
  preMatrix: AffineMatrix,
): AffineMatrix {
  return {
    ...preMatrix,
    tx: preMatrix.tx + deltaX,
    ty: preMatrix.ty + deltaY,
  };
}
interface Size {
  width: number;
  height: number;
}

interface AffineMatrix {
  a: number; // Scale X
  b: number; // Skew Y
  c: number; // Skew X
  d: number; // Scale Y
  tx: number; // Translate X
  ty: number; // Translate Y
}

/**
 * 初始化矩阵：等比填充并居中
 * @param itemSize - Item 原始尺寸
 * @param parentSize - Parent 容器尺寸
 * @returns 初始化的 PixiJS/CSS 兼容矩阵
 */
function getInitMatrix(itemSize: Size, parentSize: Size): AffineMatrix {
  const { width: w, height: h } = itemSize;
  const { width: Wp, height: Hp } = parentSize;

  // 1. 计算填充所需的最小缩放比例 (取 Max 确保覆盖所有空白)
  const scaleX = Wp / w;
  const scaleY = Hp / h;
  const s = Math.max(scaleX, scaleY);

  // 2. 计算缩放后的尺寸
  const visualW = w * s;
  const visualH = h * s;

  // 3. 计算居中平移量 (tx, ty)
  // 既然 origin 是 left-top，直接计算中心差值即可
  const tx = (Wp - visualW) / 2;
  const ty = (Hp - visualH) / 2;

  // 4. 返回矩阵对象 (对应 PixiJS Matrix 格式)
  return {
    a: s, // 水平基向量 X
    b: 0, // 水平基向量 Y
    c: 0, // 垂直基向量 X
    d: s, // 垂直基向量 Y
    tx: tx,
    ty: ty,
  };
}
function matrixToCSS(m: AffineMatrix): string {
  // 使用 toFixed 限制小数位数，提升 CSS 解析性能并减少字符串长度
  const a = m.a.toFixed(6);
  const b = m.b.toFixed(6);
  const c = m.c.toFixed(6);
  const d = m.d.toFixed(6);
  const tx = m.tx.toFixed(2); // 位移通常保留 2 位小数即可
  const ty = m.ty.toFixed(2);

  return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;
}
const ImageCropper: React.FC<CropperProps> = ({
  source,
  containerSize,
  aspectRatios,
  maxScale = 5,
  onComplete,
}) => {
  const [imgSrc, setImgSrc] = useState("");
  const [ratio, setRatio] = useState(aspectRatios[0].value);
  const imgRef = useRef<HTMLImageElement>(null);

  /* ---------------- 数据源 ---------------- */
  useEffect(() => {
    const url =
      typeof source === "string" ? source : URL.createObjectURL(source);
    setImgSrc(url);
    return () => {
      if (typeof source !== "string") URL.revokeObjectURL(url);
    };
  }, [source]);

  const imgSizeRef = useRef<Size>({ width: 1, height: 1 });

  const currentMatrixRef = useRef<AffineMatrix>({
    a: 1, // scaleX = 1
    b: 0, // skewY = 0
    c: 0, // skewX = 0
    d: 1, // scaleY = 1
    tx: 0, // translateX = 0
    ty: 0, // translateY = 0
  });
  // const [transform, setTransform] = useState<string>();
  const [transformMatrix, setTransformMatrix] = useState<AffineMatrix>({
    a: 1, // scaleX = 1
    b: 0, // skewY = 0
    c: 0, // skewX = 0
    d: 1, // scaleY = 1
    tx: 0, // translateX = 0
    ty: 0, // translateY = 0
  });
  /* ---------------- 初始化：直接 cover ---------------- */
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nW = img.naturalWidth;
    const nH = img.naturalHeight;

    imgSizeRef.current = {
      width: nW,
      height: nH,
    };

    const matrix = getInitMatrix(imgSizeRef.current, containerSize);
    currentMatrixRef.current = matrix;

    setTransformMatrix(matrix);
  };

  /* ---------------- 导出 ---------------- */
  const exportImage = async () => {
    const url = await exportCroppedImage(
      imgRef.current!,
      transformMatrix,
      containerSize,
      ratio,
    );

    onComplete?.(url);
  };
  const dragRef = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      console.log("onMouseMove");

      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;

      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;

      setTransformMatrix((pre) =>
        clipItemMatrix(
          handleDrag(dx, dy, pre),
          imgSizeRef.current,
          containerSize,
          ratio,
        ),
      );
    },
    [ratio],
  );
  const onMouseDown = (e: React.MouseEvent) => {
    console.log("onMouseDown");
    e.preventDefault();

    dragRef.current.dragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseUp = useCallback(() => {
    console.log("onMouseUp");
    dragRef.current.dragging = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [ratio]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onWheel = useCallback(
    (e: WheelEvent) => {
      console.log("onWheel");
      const rect = containerRef.current!.getBoundingClientRect();
      setTransformMatrix((pre) =>
        clipItemMatrix(
          handleWheelZoom(e, pre, rect),
          imgSizeRef.current,
          containerSize,
          ratio,
        ),
      );
    },
    [ratio],
  );

  useEffect(() => {
    setTransformMatrix((pre) =>
      clipItemMatrix(pre, imgSizeRef.current, containerSize, ratio),
    );
  }, [ratio]);

  /* ---------------- UI ---------------- */
  return (
    <div
      ref={containerRef}
      style={{
        width: containerSize.width,
        height: containerSize.height,
        background: "#000",
      }}
      className={styles.wrapper}
    >
      <img
        ref={imgRef}
        src={imgSrc}
        onLoad={onImageLoad}
        draggable={false}
        style={{
          transformOrigin: "0 0",
          transform: matrixToCSS(transformMatrix),
          cursor: "grab",
          userSelect: "none",
        }}
      />

      <CropBox
        parentSize={containerSize}
        ratio={ratio}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
      />

      {/* 控制 */}
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        {aspectRatios.map((r) => (
          <button key={r.label} onClick={() => setRatio(r.value)}>
            {r.label}
          </button>
        ))}
        <button onClick={exportImage}>完成裁剪</button>
      </div>
    </div>
  );
};

export { ImageCropper };
