/**
 * 自动注入 Iconfont SVG Symbols 的脚本
 * TypeScript 版本
 * 兼容原始 iconfont.js 功能
 */

interface InjectOptions {
  injectCss?: boolean; // 是否自动注入样式
  disableInjectSvg?: boolean; // 是否禁用 svg 注入
  svgString?: string; // SVG symbols 字符串 (由 iconfont 自动生成)
}

export function injectIconfont({
  injectCss = true,
  disableInjectSvg = false,
  svgString = (window as any)._iconfont_svg_string_4641755,
}: InjectOptions = {}): void {
  if (disableInjectSvg) return;
  if (!svgString) {
    console.warn('[iconfont] No SVG string found');
    return;
  }

  // 注入基础样式（只注入一次）
  if (injectCss && !(window as any).__iconfont__svg__cssinject__) {
    (window as any).__iconfont__svg__cssinject__ = true;
    const style = document.createElement('style');
    style.textContent = `
      .svgfont {
        display: inline-block;
        width: 1em;
        height: 1em;
        fill: currentColor;
        vertical-align: -0.1em;
        font-size: 16px;
      }
    `;
    document.head.appendChild(style);
  }

  // 注入 SVG DOM
  const injectSvg = (): void => {
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();

    const svg = div.querySelector('svg');
    if (!svg) return;

    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';

    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(svg, body.firstChild);
    } else {
      body.appendChild(svg);
    }
  };

  // 等待 DOM ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectSvg();
  } else {
    document.addEventListener('DOMContentLoaded', injectSvg, { once: true });
  }
}
