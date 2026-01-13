import { action, computed, observable } from "@tking/mobx";
import { BaseStore } from "./base";
import { IPoint, Point, Rectangle, Vector } from "src/math";
import { Matrix, Transform } from "@tking/renderer2d";
import { TransformStoreEvents } from "src/utils/event-type";
import { ElementModel } from "src/models/ElementModel";

class TransformStore extends BaseStore {
  readonly maxScale = 10;
  // readonly maxScale = 4;
  readonly minScale = 0.01;

  @observable
  isTransformingScale = false;
  @observable
  isTransformingPosition = false;

  @observable
  scale: Point = new Point(1, 1);
  @observable
  position: Point = new Point(0, 0);

  // /**
  //  * 保存 鼠标 postion,鼠标origin 点
  //  */
  // mousePosition?: Point;

  @observable.ref
  canvasTransform = new Matrix();
  // Cavans 是等比缩放
  @computed
  get canvasScale(): number {
    return this.scale.x;
  }

  @action
  setTransformingScale(value: boolean) {
    this.isTransformingScale = value;
  }

  /**
   * 调整canvas transform 可以容纳下 items worldbounds 显示
   */
  @action
  fitCanvasTransformToContent(items: ElementModel[] | ElementModel) {
    const _items = Array.isArray(items) ? items : [items];
    if (_items.length === 0) return true;

    const bounds = new Rectangle();
    for (const item of _items) {
      bounds.merge(item.worldBounds);
    }

    const corners = [
      { x: bounds.x, y: bounds.y }, // top-left
      { x: bounds.x + bounds.width, y: bounds.y }, // top-right
      { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // bottom-right
      { x: bounds.x, y: bounds.y + bounds.height }, // bottom-left
    ];
    const matrix = this.canvasTransform;

    const transformedPoints = corners.map((p) => {
      return matrix.apply(p);
    });

    const xs = transformedPoints.map((p) => p.x);
    const ys = transformedPoints.map((p) => p.y);
    const transformedBounds = new Rectangle(
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys)
    );
    const viewport = new Rectangle(
      0,
      0,
      this.appStore.renderStore.canvasRect.width,
      this.appStore.renderStore.canvasRect.height
    );
    const diff = {
      left: viewport.x - transformedBounds.x,
      right:
        transformedBounds.x +
        transformedBounds.width -
        (viewport.x + viewport.width),
      top: viewport.y - transformedBounds.y,
      bottom:
        transformedBounds.y +
        transformedBounds.height -
        (viewport.y + viewport.height),
    };

    const overflows = Object.entries(diff).filter(([side, d]) => d > 0);
    if (overflows.length === 0) return null;

    const [maxSide, maxDist] = overflows.reduce((max, curr) => {
      return curr[1] > max[1] ? curr : max;
    });
    const center = {
      x: transformedBounds.x + transformedBounds.width / 2,
      y: transformedBounds.y + transformedBounds.height / 2,
    };

    let edgePoint: { x: number; y: number } | undefined;
    let fitSize: number | undefined;
    switch (maxSide) {
      case "left":
        edgePoint = { x: transformedBounds.x, y: center.y };
        fitSize = transformedBounds.width / 2;
        break;
      case "right":
        edgePoint = {
          x: transformedBounds.x + transformedBounds.width,
          y: center.y,
        };
        fitSize = transformedBounds.width / 2;
        break;
      case "top":
        edgePoint = { x: center.x, y: transformedBounds.y };
        fitSize = transformedBounds.height / 2;
        break;
      case "bottom":
        edgePoint = {
          x: center.x,
          y: transformedBounds.y + transformedBounds.height,
        };
        fitSize = transformedBounds.height / 2;
        break;
    }

    if (edgePoint && fitSize) {
      const dx = edgePoint.x - center.x;
      const dy = edgePoint.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const fitScale = (fitSize - 20) / distance;

      const newScale = fitScale * this.canvasScale;
      if (newScale < this.minScale) {
        console.log("minscale", newScale);
        return null;
      }
      console.log("fitScale", newScale, fitScale);
      this.updateScale(
        this.appStore.renderStore.canvasRect.center.toVector(),
        fitScale
      );
    }
  }
  @action
  setTransformingPosition(value: boolean) {
    this.isTransformingPosition = value;
  }
  @computed
  get isTransforming() {
    return this.isTransformingScale || this.isTransformingPosition;
  }

  // @computed
  // get canvasTransform() {
  //   return this.canvasTransform;
  // }
  private get transformContainer() {
    return this.appStore.renderStore.transformContainer;
  }

  /**
   * 浏览器左上角(世界坐标系Origin)，在Canvas 坐标系下的坐标
   */
  @computed
  get canvasOffset(): IPoint {
    return this.position;
  }
  @action
  resetTransform() {
    this.position = new Point(0, 0);
    this.scale = new Point(1, 1);

    this.emit(TransformStoreEvents.POSITION, this.position);
    this.emit(TransformStoreEvents.SCALE, this.scale);

    // this.updateTransform();
    // this.notifyResetTransform();
  }
  @action
  updatePosition(offset: Vector) {
    const newX = this.position.x + offset.x;
    const newY = this.position.y + offset.y;
    // TODO disable undoredo
    this.position = new Point(newX, newY);
    this.transformContainer.transform.position.set(newX, newY);
    this.updateTransform();
    this.emit(TransformStoreEvents.POSITION, this.position);
    // this.notifyUpdatePosition();
  }

  @action
  updateScale(center: Vector, delta: number) {
    let scale = 1;
    const preScale = this.canvasScale;
    if (preScale * delta >= this.maxScale) {
      scale = this.maxScale / preScale;
    } else if (preScale * delta <= this.minScale) {
      scale = this.minScale / preScale;
    } else {
      scale = delta;
    }

    this.doScale(center, scale);
    this.updateTransform();

    this.emit(TransformStoreEvents.POSITION, this.position);
    this.emit(TransformStoreEvents.SCALE, this.scale);

    // this.notifyUpdateScale();
  }

  private isScaleable() {
    const preScale = this.canvasScale;
    if (preScale >= this.maxScale) {
      return false;
    }

    if (preScale <= this.minScale) {
      return false;
    }

    return true;
  }
  private doScale(center: Vector, scale: number) {
    const originMatrix = this.canvasTransform;
    const Mt = new Matrix();
    Mt.tx = originMatrix.tx;
    Mt.ty = originMatrix.ty;

    const newPoint = Mt.clone().invert().apply(center);
    const MScaleOrigin = new Matrix();
    MScaleOrigin.a = originMatrix.a;
    MScaleOrigin.d = originMatrix.d;
    const M1 = new Matrix();
    M1.tx = -newPoint.x;
    M1.ty = -newPoint.y;
    const M1Invert = M1.clone().invert();

    const MScale = new Matrix();
    MScale.a = scale;
    MScale.d = scale;

    const resMatrix = Mt.append(
      M1Invert.append(MScale.append(M1.append(MScaleOrigin)))
    );
    const tempTransfrom = new Transform();
    tempTransfrom.setFromMatrix(resMatrix);

    this.scale = new Point(tempTransfrom.scale.x, tempTransfrom.scale.y);
    // TODO support rotation
    // this.rotation = tempTransfrom.rotation;
    // this.skew = new Point(tempTransfrom.skew.x, tempTransfrom.skew.y);
    this.position = new Point(
      tempTransfrom.position.x,
      tempTransfrom.position.y
    );

    this.transformContainer.transform.position.set(
      tempTransfrom.position.x,
      tempTransfrom.position.y
    );
    this.transformContainer.transform.scale.set(
      tempTransfrom.scale.x,
      tempTransfrom.scale.y
    );
  }

  private updateTransform() {
    this.canvasTransform = new Matrix(
      this.scale.x,
      0,
      0,
      this.scale.y,
      this.position.x,
      this.position.y
    );

    // this._transform.setFromMatrix(matrix);
    // this.canvasTransform.setFromMatrix(matrix);
  }

  // private notifyUpdateScale() {
  //   this.appStore.documentStore.updateScale(this.position, this.scale);
  //   this.appStore.backgroundStore.updateOrCreateLineGridModel();
  // }

  // private notifyUpdatePosition() {
  //   this.appStore.documentStore.updatePosition(this.position);
  //   this.appStore.backgroundStore.updateOrCreateLineGridModel();
  // }
  // private notifyResetTransform() {
  //   this.appStore.documentStore.resetTransform();
  //   this.appStore.backgroundStore.updateOrCreateLineGridModel();
  // }
}

export { TransformStore };
