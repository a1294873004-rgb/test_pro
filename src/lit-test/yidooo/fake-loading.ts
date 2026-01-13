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
      width: 100%;
      height: 100%;
      background: #394f3c;
      position: relative;
    }

    .FakeLoading {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      img {
        width: 120px;
        height: 160px;
        object-fit: contain;
        margin-bottom: 12px;
      }

      .barContainer {
        display: block;
        width: 100%;
        height: 6px;
        border-radius: 49px;
        overflow: hidden;
        background-color: #eee;
        margin-bottom: 6px;
        .bar {
          height: 100%;
          width: 0%;
          border-radius: 10px;
          background: linear-gradient(
            90deg,
            #26bbff 0%,
            #7affaf 100.5%,
            #ffc249 201%
          );
          transition: width 0.2s linear;
        }
      }

      .text {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;

        text-align: center;

        color: #fffdfa;
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
      <img
        src="${CONFIG.dev
          ? "https://dscdn.yidooo.com/yd_sys/web/front_end_oss_data/1767144259895_00db.webp"
          : "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1767144259895_00db.webp"}"
      />

      <div class="barContainer">
        <div class="bar" style="width:${this.progress}%"></div>
      </div>
      <div class="text">
        The expected waiting time is 40 seconds, 50% of the image is being
        generated ...
      </div>
    </div>`;
  }
}
