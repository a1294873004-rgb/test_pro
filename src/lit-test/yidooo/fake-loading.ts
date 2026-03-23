import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("yidooo-fake-loading")
export class FakeLoading extends LitElement {
  private intervalId: number | undefined;

  @state()
  private progress = 0;

  @property({ type: Number })
  fakeTime: number = 10000;

  @property({ type: Number })
  maxProgress: number = 95;

  static override styles = css`
    :host {
      /* 重要：自定义元素默认是 inline，必须设为 block 宽高才生效 */
      display: block;
      width: 100%;
      height: 100%;
      height: 500px;
      width: 300px;
      /* background: #394f3c; */
      position: relative;
    }

    .FakeLoading {
      display: flex;
      align-items: center;
      align-items: flex-start;
      flex-direction: column;
      justify-content: space-between;
      width: 100%; /* 改为 100% 以适应 host */
      height: 100%;
      flex-direction: column;
      padding: 16px;
      box-sizing: border-box;
      background:
        linear-gradient(
          69.46deg,
          rgba(204, 229, 255, 0.5) 24.3%,
          rgba(255, 227, 171, 0.5) 75.96%,
          rgba(204, 229, 255, 0.5) 96.05%,
          rgba(255, 227, 171, 0.5) 100%
        ),
        #394f3c;
    }

    .FakeLoading img {
      width: 120px;
      height: 160px;
      object-fit: contain;
      margin-bottom: 12px;
    }

    /* 进度条样式 */
    .barContainer {
      display: block;
      width: 100%; /* 限制进度条宽度 */
      height: 6px;
      border-radius: 49px;
      overflow: hidden;
      background-color: #eee;
      margin-bottom: 12px;
    }

    .bar {
      height: 100%;
      width: 60%; /* 这里可以根据 property 动态绑定 */
      border-radius: 10px;
      background: linear-gradient(
        90deg,
        #26bbff 0%,
        #7affaf 100.5%,
        #ffc249 201%
      );
      transition: width 0.2s linear;
    }

    .text {
      font-family: "PingFang SC", sans-serif;
      font-weight: 400;
      font-size: 14px;
      text-align: center;
      color: #fffdfa;
      margin-top: 10px;
    }

    .containerWrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 10px;
      flex-direction: column;
    }
    /* --- Jelly Triangle 动画核心样式 --- */
    .container {
      --uib-size: 32px;
      --uib-color: #cce5ff;
      --uib-speed: 1.75s;
      position: relative;
      height: var(--uib-size);
      width: var(--uib-size);
      /* 关键：必须引用当前 Shadow DOM 内部的 SVG ID */
      filter: url("#uib-jelly-triangle-ooze");
      margin-bottom: 20px;
      min-width: 0;
      flex-shrink: 0;

      top: 10px;
      left: 16px;
    }

    .container::before,
    .container::after,
    .dot {
      content: "";
      position: absolute;
      width: 33%;
      height: 33%;
      background-color: var(--uib-color);
      border-radius: 100%;
      will-change: transform;
      transition: background-color 0.3s ease;
    }

    .dot {
      top: 6%;
      left: 30%;
      animation: grow var(--uib-speed) ease infinite;
    }

    .container::before {
      bottom: 6%;
      right: 0;
      animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.666)
        infinite;
    }

    .container::after {
      bottom: 6%;
      left: 0;
      animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.333)
        infinite;
    }

    .traveler {
      position: absolute;
      top: 6%;
      left: 30%;
      width: 33%;
      height: 33%;
      background-color: var(--uib-color);
      border-radius: 100%;
      animation: triangulate var(--uib-speed) ease infinite;
      transition: background-color 0.3s ease;
    }

    /* 隐藏 SVG 定义 */
    .svg-filters {
      width: 0;
      height: 0;
      position: absolute;
    }

    @keyframes triangulate {
      0%,
      100% {
        transform: none;
      }
      33.333% {
        transform: translate(120%, 175%);
      }
      66.666% {
        transform: translate(-95%, 175%);
      }
    }

    @keyframes grow {
      0%,
      85%,
      100% {
        transform: scale(1.5);
      }
      50%,
      60% {
        transform: scale(0);
      }
    }
  `;
  override connectedCallback() {
    super.connectedCallback();
    this.startFakeProgress();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startFakeProgress() {
    const intervalTime = 100; // 每100ms更新一次
    const steps = this.fakeTime / intervalTime;
    let stepCount = 0;

    this.intervalId = window.setInterval(() => {
      stepCount++;
      const baseProgress = (this.maxProgress / steps) * stepCount;
      const jitter = Math.random() * 2;
      this.progress = Math.min(baseProgress + jitter, this.maxProgress);

      if (stepCount >= steps) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
    }, intervalTime);
  }

  override render() {
    return html`<div class="FakeLoading">
      <div class="container">
        <div class="dot"></div>
        <div class="traveler"></div>
      </div>
      <div class="containerWrapper">
        <div class="text">
          The expected waiting time is 40 seconds, 50% of the image is being
          generated ...
        </div>
        <div class="barContainer">
          <div class="bar" style="width:${this.progress}%"></div>
        </div>
        <svg width="0" height="0" class="svg">
          <defs>
            <filter id="uib-jelly-triangle-ooze">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="3.333"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="ooze"
              />
              <feBlend in="SourceGraphic" in2="ooze" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>`;
  }
}
