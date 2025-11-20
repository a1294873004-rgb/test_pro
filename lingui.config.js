import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'zh', // 源语言设为中文
  locales: ['zh', 'en', 'ja'], // 支持中文、英文、日文
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po', // 使用PO文件格式
  compileNamespace: 'ts',
});
