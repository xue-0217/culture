import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { CSSProperties } from 'react';
import DetailNextLink from '../components/DetailNextLink';
import DetailReading from '../components/DetailReading';
import { exhibitionTitle, exhibitionWorks, findExhibit, formerExhibitDestinations, gallerySections, type Exhibit } from '../data/exhibition';

function ExhibitTile({ work }: { work: Exhibit }) {
  return (
    <Link className="exhibit-tile" to={`/exhibitions/${work.id}`}>
      <img src={work.image} alt={work.alt} loading="lazy" decoding="async" />
      <h3>{work.title} <ArrowUpRight size={19} aria-hidden="true" /></h3>
    </Link>
  );
}

export default function Exhibitions() {
  return (
    <div className="editorial-page">
      <section className="editorial-lead" aria-labelledby="exhibition-title">
        <div className="editorial-lead-copy">
          <p className="editorial-label">线上展览</p>
          <h1 id="exhibition-title">{exhibitionTitle}</h1>
          <p>一片玻璃能改变光的颜色，一纸拓印能留下器物的凹凸。循着材料的变化，看看手艺如何走进近现代设计和数字创作。</p>
          <a href="#traditional" className="text-link">进入展览 <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
        <figure className="editorial-lead-image">
          <img src="/images/collection/exhibition-materials.webp" alt="陶土模型、金属格片和透光玻璃并排陈列" fetchPriority="high" />
        </figure>
      </section>

      <nav className="editorial-index wrap" aria-label="展览章节">
        {gallerySections.map(section => (
          <a key={section.id} href={`#${section.id}`}>{section.title} <ArrowDown size={14} aria-hidden="true" /></a>
        ))}
      </nav>

      {gallerySections.map(section => (
        <section className="gallery-section wrap" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
          <header className="editorial-section-heading">
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <p>{section.description}</p>
          </header>
          <div className="gallery-works" data-layout={section.id}>
            {section.works.map(work => <ExhibitTile key={work.id} work={work} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ExhibitDetail() {
  const { workId } = useParams();
  const work = findExhibit(workId);
  const formerDestination = formerExhibitDestinations.get(workId ?? '');

  if (!work) {
    if (formerDestination) return <Navigate to={formerDestination} replace />;
    return (
      <section className="editorial-page">
        <div className="wrap page-shell page-intro">
          <h1>未找到这件作品</h1>
          <Link className="text-link" to="/exhibitions">返回展览 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }

  const section = gallerySections.find(item => item.works.includes(work));
  const followingWork = exhibitionWorks[exhibitionWorks.indexOf(work) + 1];

  return (
    <article className="editorial-page" style={{ '--detail-tint': work.detailTint } as CSSProperties}>
      <div className="wrap editorial-return">
        <Link to={section ? `/exhibitions#${section.id}` : '/exhibitions'} className="text-link"><ArrowLeft size={17} aria-hidden="true" /> {exhibitionTitle}</Link>
      </div>
      <div className="editorial-object wrap">
        <figure>
          <img src={work.detailImage} alt={work.detailAlt} fetchPriority="high" />
        </figure>
        <div className="editorial-object-copy">
          <p className="editorial-label">{section?.title}</p>
          <h1>{work.title}</h1>
          <p>{work.caption}</p>
        </div>
      </div>
      <DetailReading title="展品解读" sections={work.reading} source={work.readingSource} />
      <section className="editorial-workshop wrap" aria-labelledby="workshop-entry">
        <div>
          <h2 id="workshop-entry">带着这件作品去创作</h2>
          <p>{work.keywords.split(' + ').join(' · ')}</p>
        </div>
        <div className="editorial-workshop-links">
          <Link className="button-ink" to={`/create?work=${work.id}&mode=poem`}>用这张图作诗 <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Link className="text-link" to={`/create?work=${work.id}&mode=story`}>用这些词写故事 <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
      <DetailNextLink
        to={followingWork ? `/exhibitions/${followingWork.id}` : '/exhibitions'}
        label={followingWork ? '下一件展品' : '已到最后一件'}
        title={followingWork?.title ?? '返回展览目录'}
        atEnd={!followingWork}
      />
    </article>
  );
}
