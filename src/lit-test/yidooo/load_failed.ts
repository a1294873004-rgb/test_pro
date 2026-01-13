import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { i18n } from "../base-i18n-component";

const RegenIcon = html`<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M3 4.33325H10.3333C11.8061 4.33325 13 5.52716 13 6.99992V8.33325"
    stroke="#FFFDFA"
    stroke-width="0.666667"
    stroke-linecap="round"
  />
  <path
    d="M5.66667 3L3 4.33333H5.66667V3Z"
    fill="#FFFDFA"
    stroke="#FFFDFA"
    stroke-width="0.666667"
    stroke-linejoin="round"
  />
  <path
    d="M13 11.6667H5.66667C4.19391 11.6667 3 10.4728 3 9.00008V7.66675"
    stroke="#FFFDFA"
    stroke-width="0.666667"
    stroke-linecap="round"
  />
  <path
    d="M10.3333 13L13 11.6667H10.3333V13Z"
    fill="#FFFDFA"
    stroke="#FFFDFA"
    stroke-width="0.666667"
    stroke-linejoin="round"
  />
  <path
    d="M7.87528 6.00468C7.91823 5.8886 8.08242 5.8886 8.12537 6.00468L8.31139 6.50739C8.51396 7.05483 8.94558 7.48645 9.49302 7.68902L9.99573 7.87503C10.1118 7.91799 10.1118 8.08217 9.99573 8.12513L9.49302 8.31115C8.94558 8.51372 8.51396 8.94534 8.31139 9.49278L8.12537 9.99548C8.08242 10.1116 7.91823 10.1116 7.87528 9.99548L7.68926 9.49278C7.48669 8.94534 7.05507 8.51372 6.50763 8.31115L6.00493 8.12513C5.88884 8.08217 5.88884 7.91799 6.00493 7.87503L6.50763 7.68902C7.05507 7.48645 7.48669 7.05483 7.68926 6.50739L7.87528 6.00468Z"
    fill="#FFC249"
  />
</svg> `;
@customElement("yidooo-load-failed")
export class LoadFailed extends LitElement {
  @property({ type: String })
  text: string = "";

  @property({ attribute: false })
  onClick?: () => void;
  static override styles = css`
    :host {
      width: 100%;
      height: 100%;
      background: #394f3c;
      position: relative;
    }

    .LoadFailed {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      img {
        width: 320px;
        height: 180px;
        object-fit: contain;
        margin-bottom: 8px;
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

      .bottom {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 14px;

        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fffdfa;
        gap: 4px;

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
          gap: 4px;
          background: #6f685599;
          border-radius: 4px;
          color: #ffffff;
        }
      }
    }
  `;

  override render() {
    return html`<div class="LoadFailed">
      <img
        src="${CONFIG.dev
          ? "https://dscdn.yidooo.com/yd_sys/web/front_end_oss_data/1767162663183_1590.webp"
          : "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1767162663183_1590.webp"}"
      />
      <div class="bottom">
        <span> ${this.text} </span>
        <div @click="${() => this.onClick?.()}" class="button">
          ${RegenIcon} ${i18n.t("load.failed.regenerate")}
        </div>
      </div>
    </div>`;
  }
}
