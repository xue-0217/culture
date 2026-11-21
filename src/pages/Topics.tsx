import { ArrowUpRight } from 'lucide-react';

const topics = [
  {
    title: '非遗传承',
    description: '查阅非遗项目名录、传承人资料，以及传统技艺的图像与记录。',
    image: '/images/cixiu.png',
    href: 'https://www.ihchina.cn/',
    site: '中国非物质文化遗产网',
  },
  {
    title: '地域风物',
    description: '从地理、村落与生活方式出发，读不同地方的自然和人文。',
    image: '/images/jiangnanshuixiang.png',
    href: 'https://www.dili360.com/',
    site: '中国国家地理网',
  },
  {
    title: '数字艺术',
    description: '浏览插画、视觉传达与数字艺术，看看创作者怎样使用新的媒介。',
    image: '/images/collection/topics-digital-projection.webp',
    href: 'https://www.zcool.com.cn/',
    site: '站酷',
  },
];

export default function Topics() {
  return (
    <div className="editorial-page">
      <header className="atlas-heading wrap">
        <h1>文化专题</h1>
        <p>从这里进入专题网站，继续探索传统技艺、地方风物与数字创作。</p>
      </header>
      <div className="wrap">
        {topics.map(topic => (
          <a className="atlas-entry topic-entry" href={topic.href} target="_blank" rel="noopener noreferrer" key={topic.href}>
            <img className="topic-image" src={topic.image} alt="" loading="lazy" decoding="async" />
            <div className="atlas-entry-copy">
              <h2>{topic.title}</h2>
              <p>{topic.description}</p>
              <span className="text-link">
                访问{topic.site} <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
