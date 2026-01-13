import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

type ChatMode = "chat" | "script" | "story" | "world";

@customElement("ask-ai-panel")
export class ChatInput extends LitElement {
  @state()
  private value = "";

  @state()
  private mode: ChatMode = "chat";

  @state()
  private open = false;

  private modeLabelMap: Record<ChatMode, string> = {
    chat: "对话模式",
    script: "剧本大师",
    story: "故事蓝图",
    world: "世界观设计",
  };

  static override styles = css`
    :host {
      display: block;
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont;
      color: #e6e3da;
    }

    .container {
      background: linear-gradient(180deg, #1b1a16, #14130f);
      border-radius: 12px;
      padding: 12px;
      box-shadow: inset 0 0 0 1px #2a281f;
    }

    textarea {
      width: 100%;
      height: 80px;
      resize: none;
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-size: 16px;
    }

    textarea::placeholder {
      color: #8a8677;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }

    .left {
      position: relative;
    }

    .mode-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 8px;
      background: #2a281f;
      color: #e6e3da;
      cursor: pointer;
      border: 1px solid #3a372b;
      font-size: 14px;
    }

    .dropdown {
      position: absolute;
      bottom: 38px;
      left: 0;
      background: #1f1d16;
      border: 1px solid #343225;
      border-radius: 10px;
      padding: 6px;
      min-width: 140px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      z-index: 10;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .item:hover {
      background: #2d2a20;
    }

    .right {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #2a281f;
      border: 1px solid #3a372b;
      color: #f2c94c;
      cursor: pointer;
      display: grid;
      place-items: center;
      font-size: 16px;
    }
  `;

  private toggleDropdown() {
    this.open = !this.open;
  }

  private selectMode(mode: ChatMode) {
    this.mode = mode;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("mode-change", {
        detail: { mode },
        bubbles: true,
        composed: true,
      })
    );
  }

  private send() {
    this.dispatchEvent(
      new CustomEvent("send", {
        detail: {
          value: this.value,
          mode: this.mode,
        },
        bubbles: true,
        composed: true,
      })
    );
    this.value = "";
  }

  override render() {
    return html`
      <div class="container">
        <textarea
          .value=${this.value}
          placeholder="有什么想问的？"
          @input=${(e: InputEvent) =>
            (this.value = (e.target as HTMLTextAreaElement).value)}
        ></textarea>

        <div class="footer">
          <div class="left">
            <button class="mode-btn" @click=${this.toggleDropdown}>
              💬 ${this.modeLabelMap[this.mode]}
            </button>

            ${this.open
              ? html`
                  <div class="dropdown">
                    ${Object.entries(this.modeLabelMap).map(
                      ([key, label]) => html`
                        <div
                          class="item"
                          @click=${() => this.selectMode(key as ChatMode)}
                        >
                          ${label}
                        </div>
                      `
                    )}
                  </div>
                `
              : null}
          </div>

          <div class="right">
            <button class="icon-btn" title="设置">⚙</button>
            <button class="icon-btn" title="发送" @click=${this.send}>➤</button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chat-input": ChatInput;
  }
}
