// src/base-i18n-component.ts
import { LitElement } from "lit";
import { state } from "lit/decorators.js";

// src/i18n.ts
type Messages = Record<string, Record<string, string>>;

class I18n {
  private currentLang: string = "en";
  private messages: Messages = {};
  private subscribers: Set<() => void> = new Set();

  init(messages: Messages, defaultLang: string = "en") {
    this.messages = messages;
    this.currentLang = defaultLang;
  }

  t(key: string) {
    return this.messages[this.currentLang]?.[key] ?? key;
  }

  setLanguage(lang: string) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    this.subscribers.forEach((cb) => cb());
  }

  getLanguage() {
    return this.currentLang;
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}

const i18n = new I18n();

class BaseI18nComponent extends LitElement {
  // 避免与 Lit 内部或 DOM 的 lang 属性冲突，使用 _currentLang
  @state() private _currentLang: string = i18n.getLanguage();

  private unsubscribe: () => void;

  constructor() {
    super();
    this.unsubscribe = i18n.subscribe(() => {
      this._currentLang = i18n.getLanguage();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe();
  }

  /**
   * 子组件可以通过 this.currentLang 获取当前语言
   */
  protected get currentLang() {
    return this._currentLang;
  }
}
export { BaseI18nComponent, i18n };
