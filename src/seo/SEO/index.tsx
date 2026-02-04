import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string; // 页面标题
  description: string; // 页面描述
  path: string; // 路由路径，如 "/" 或 "/pricing"
}

const SEO = ({ title, description, path }: SEOProps) => {
  const siteName = 'Yidooo';
  const baseUrl = 'https://www.yidooo.com';

  // 处理路径：确保首页路径不出现双斜杠，子路径正确拼接
  const fullUrl = `${baseUrl}${path === '/' ? '' : path}`;

  return (
    <Helmet>
      {/* 标题 */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="title" content={`${title} | ${siteName}`} />

      {/* 描述 */}
      <meta name="description" content={description} />

      {/* 核心 SEO 标签：Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* 社交媒体分享预览 (Open Graph) - 建议顺手加上 */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769430096474_6e64.svg"
      />
    </Helmet>
  );
};

export { SEO };
