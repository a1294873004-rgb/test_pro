// src/wrapper-component.ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./test";
import "./yidooo";
import { BaseI18nComponent, i18n } from "./base-i18n-component";

@customElement("my-wrapper")
export class MyWrapper extends BaseI18nComponent {
  static override styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: center;

      background: #1f1d18;
    }
    button {
      margin: 0 8px;
      padding: 4px 12px;
      cursor: pointer;
    }
  `;

  private handleRetry() {
    console.log("handleRetry");
  }
  override render() {
    return html`
      <!-- <yidooo-fake-loading fakeTime="500000"></yidooo-fake-loading> -->

      <ask-ai-panel></ask-ai-panel>
      <yidooo-load-failed
        .onClick="${this.handleRetry}"
        text="视频生成失败 QAQ... ..."
      ></yidooo-load-failed>
      <h2>${i18n.t("hello")}</h2>
      <p>${i18n.t("welcome")}</p>
      <div>
        <button @click=${() => i18n.setLanguage("en")}>EN</button>
        <button @click=${() => i18n.setLanguage("zh")}>中文</button>
      </div>
      <div style="margin-top:8px; font-size:12px; color:#888;">
        Current lang: ${this.currentLang}
      </div>
    `;
  }
}
i18n.init(
  {
    en: {
      hello: "Hello",
      welcome: "Welcome",
      description: "This is a Lit i18n demo.",
    },
    zh: {
      hello: "你好",
      welcome: "欢迎",
      description: "这是一个 Lit i18n 演示。",
    },
    es: {
      hello: "Hola",
      welcome: "Bienvenido",
      description: "Esta es una demostración de Lit i18n.",
    },
  },
  "en"
);
function run() {
  const root = document.getElementById("root");
  if (root) {
    const wrapper = document.createElement("my-wrapper");
    wrapper.title = "Welcome to My Lit App";
    root.appendChild(wrapper);
  } else {
    console.error("No #root element found");
  }
}
run();
