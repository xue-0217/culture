import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { link } from 'fs';

const TOPICS = [
  {
    id: 'intangible',
    title: '非遗传承',
    subtitle: 'Intangible Cultural Heritage',
    description: '探索皮影、剪纸、刺绣等非物质文化遗产的数字新生。',
    image: '/src/assets/cixiu.png',
    color: 'bg-china-red/10 text-china-red',
    link: 'https://www.ihchina.cn/index.html/#page1'
  },
  {
    id: 'local',
    title: '地域风物',
    subtitle: 'Local Culture',
    description: '从江南水乡到大漠孤烟，感受不同地域的独特文化魅力。',
    image: '/src/assets/jiangnanshuixiang.png',
    color: 'bg-gold/10 text-gold',
    link:'https://www.dili360.com/'
  },
  {
    id: 'digital',
    title: '数字艺术',
    subtitle: 'Digital Art',
    description: '传统文化符号在赛博朋克、像素风等现代语境下的重构。',
    image: '/src/assets/shuziyishu.png',
    color: 'bg-ink/10 text-ink',
    link:'https://www.zcool.com.cn/'
  }
];

export default function Explore() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-6">文化专题</h1>
        <p className="text-ink-light tracking-widest leading-relaxed">
          深入探索不同维度的文化宝库，发现传统与现代交织的无限可能。
        </p>
      </div>

      <div className="space-y-12">
        {TOPICS.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center group cursor-pointer`}
            onClick={() => topic.link && window.open(topic.link, '_blank')}
          >
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden relative shadow-sm">
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-6 w-max ${topic.color}`}>
                {topic.subtitle}
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6 group-hover:text-china-red transition-colors">
                {topic.title}
              </h2>
              <p className="text-ink-light text-lg leading-relaxed mb-8 max-w-md">
                {topic.description}
              </p>
              <div className="flex items-center gap-2 text-ink font-serif tracking-widest font-medium group-hover:text-china-red transition-colors">
                进入专题 <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
