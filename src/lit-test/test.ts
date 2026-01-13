// 文件名: my-counter.ts
import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { i18n } from "./base-i18n-component";

@customElement("my-counter")
export class MyCounter extends LitElement {
  // 属性，可以从外部设置
  @property({ type: Number }) count = 0;

  // 内部状态，不会被外部直接修改
  @state() private lastUpdated: Date | null = null;

  // 样式
  static override styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      text-align: center;
      border: 2px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      width: 200px;
      margin: 20px auto;
      background-color: #f9f9f9;
    }
    button {
      margin: 0 8px;
      padding: 8px 16px;
      font-size: 16px;
      cursor: pointer;
    }
    .count {
      font-size: 24px;
      margin: 16px 0;
      color: #333;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
  `;

  // 组件渲染
  override render() {
    return html`
      <div class="count">${this.count}</div>
      <h2>${i18n.t("hello")}</h2>
      <p>${i18n.t("description")}</p>
      <button @click=${this.decrement}>-</button>
      <button @click=${this.increment}>+</button>
      ${this.lastUpdated
        ? html`<div class="time">
            Last updated: ${this.lastUpdated.toLocaleTimeString()}
          </div>`
        : ""}
    `;
  }

  // 属性更新钩子
  protected override updated(changedProps: PropertyValues) {
    if (changedProps.has("count")) {
      this.lastUpdated = new Date();
      // 触发自定义事件
      this.dispatchEvent(
        new CustomEvent("count-changed", {
          detail: { count: this.count },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // 方法
  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}
