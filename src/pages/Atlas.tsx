import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { CSSProperties } from 'react';
import DetailNextLink from '../components/DetailNextLink';
import DetailReading from '../components/DetailReading';
import { craftEntries } from '../data/exhibition';

export default function Atlas() {
  return (
    <div className="editorial-page">
      <header className="atlas-heading wrap">
        <h1>工艺图鉴</h1>
        <p>从材料和手法看一门手艺，读过一条，再顺着图鉴走到下一条。</p>
      </header>
      <div className="atlas-index wrap">
        {craftEntries.map(craft => (
            <article className="atlas-entry" key={craft.id}>
              <Link to={`/atlas/${craft.id}`} className="atlas-entry-image" tabIndex={-1} aria-hidden="true">
                <img src={craft.image} alt={craft.imageAlt} loading="lazy" decoding="async" />
              </Link>
              <div className="atlas-entry-copy">
                <p className="editorial-label">{craft.region}</p>
                <h2><Link to={`/atlas/${craft.id}`}>{craft.title} <ArrowUpRight size={22} aria-hidden="true" /></Link></h2>
                <p>{craft.summary}</p>
              </div>
            </article>
        ))}
      </div>
    </div>
  );
}

export function CraftDetail() {
  const { craftId } = useParams();
  const craftIndex = craftEntries.findIndex(entry => entry.id === craftId);
  const craft = craftEntries[craftIndex];

  if (!craft) {
    return (
      <section className="editorial-page">
        <div className="wrap page-shell page-intro">
          <h1>未找到这个工艺条目</h1>
          <Link className="text-link" to="/atlas">返回图鉴 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }

  const followingCraft = craftEntries[craftIndex + 1];

  return (
    <article className="editorial-page craft-detail" style={{ '--detail-tint': craft.detailTint } as CSSProperties}>
      <div className="wrap editorial-return">
        <Link to="/atlas" className="text-link"><ArrowLeft size={17} aria-hidden="true" /> 工艺图鉴</Link>
      </div>
      <div className="editorial-object wrap">
        <figure>
          <img src={craft.detailImage} alt={craft.detailAlt} fetchPriority="high" />
        </figure>
        <div className="editorial-object-copy">
          <p className="editorial-label">{craft.region}</p>
          <h1>{craft.title}</h1>
          <p>{craft.introduction}</p>
        </div>
      </div>
      <DetailReading title="工艺笔记" sections={craft.reading} />
      <section className="atlas-reading wrap" aria-labelledby="atlas-reading-title">
        <h2 id="atlas-reading-title">从哪里看起</h2>
        <dl>
          {craft.process.map(item => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>
        <p className="atlas-source">
          资料来源 <a className="text-link" href={craft.sourceUrl} target="_blank" rel="noreferrer">中国非物质文化遗产网 <ArrowUpRight size={15} aria-hidden="true" /></a>
        </p>
      </section>
      <DetailNextLink
        to={followingCraft ? `/atlas/${followingCraft.id}` : '/atlas'}
        label={followingCraft ? '下一条图鉴' : '已到最后一条'}
        title={followingCraft?.title ?? '返回图鉴目录'}
        atEnd={!followingCraft}
      />
    </article>
  );
}
