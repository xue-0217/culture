export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  image?: string; // 别名，用于详情页
  author: string;
  creator?: string; // 别名，用于详情页
  likes: number;
  tags: string[];
  type: 'art' | 'history' | 'digital';
  views?: number;
  comments?: number;
}

export const mockFeed: CulturalItem[] = [
  {
    id: '1',
    title: '赛博朋克·敦煌',
    description: '当古老的飞天壁画遇上未来科技，霓虹灯下的莫高窟展现出跨越千年的数字美学。',
    imageUrl: '/src/assets/saibopengke.jpg',
    author: '数字游民',
    likes: 1240,
    tags: ['敦煌', '赛博朋克', 'AI重塑'],
    type: 'digital',
    views: 3420,
    comments: 89
  },
  {
    id: '2',
    title: '水墨江南·烟雨',
    description: '传统水墨技法与现代构图的碰撞，AI生成的江南水乡，保留了留白的意境。',
    imageUrl: '/src/assets/yanyu.jpg',
    author: '青绿山水',
    likes: 856,
    tags: ['水墨', '江南', '传统'],
    type: 'art',
    views: 2890,
    comments: 67
  },
  {
    id: '3',
    title: '京韵·生旦净丑',
    description: '通过AI提取京剧脸谱特征，重新设计的现代潮流服饰图案。',
    imageUrl: '/src/assets/shengdanjingchou.jpg',
    author: '戏梦',
    likes: 2100,
    tags: ['京剧', '非遗', '潮流'],
    type: 'history',
    views: 4560,
    comments: 156
  },
  {
    id: '4',
    title: '青铜器·纹理重构',
    description: '商周青铜器饕餮纹的数字化解构与三维重塑。',
    imageUrl: '/src/assets/qingtongqi.jpg',
    author: '考古AI',
    likes: 432,
    tags: ['青铜器', '纹理', '历史'],
    type: 'history',
    views: 1890,
    comments: 34
  },
  {
    id: '5',
    title: '赛博·皮影戏',
    description: '光影艺术的现代演绎，机械骨骼与传统皮影的结合。',
    imageUrl: '/src/assets/piyingxi.jpg',
    author: '光影魔术手',
    likes: 1560,
    tags: ['皮影', '光影', '数字艺术'],
    type: 'digital',
    views: 5230,
    comments: 112
  },
  {
    id: '6',
    title: '千里江山·像素风',
    description: '王希孟《千里江山图》的像素化重绘，致敬古典与复古游戏。',
    imageUrl: '/src/assets/jiangshan.jpg',
    author: 'PixelArt',
    likes: 3200,
    tags: ['像素', '名画', '重绘'],
    type: 'art',
    views: 6780,
    comments: 234
  }
];

// 首页精选内容 - 与社区不同的主题
export const featuredFeed: CulturalItem[] = [
  {
    id: '7',
    title: '二十四节气·现代图鉴',
    description: '将传统节气文化与现代平面设计语言融合，创作出适合新媒体传播的节气视觉体系。',
    imageUrl: '/src/assets/jieqi.png',
    author: '节气研究员',
    likes: 3420,
    tags: ['节气', '平面设计', '传承'],
    type: 'art',
    views: 5420,
    comments: 178
  },
  {
    id: '8',
    title: '苗族银饰·3D打印重生',
    description: '使用参数化设计重构苗族银饰的繁复纹样，通过3D打印技术让传统工艺焕发新生。',
    imageUrl: '/src/assets/miaozu.png',
    author: '工艺创新者',
    likes: 2180,
    tags: ['银饰', '3D打印', '民族'],
    type: 'digital',
    views: 4150,
    comments: 92
  },
  {
    id: '9',
    title: '甲骨文·字体设计',
    description: '从甲骨文原形到现代汉字的演变可视化，开发一套兼具历史感与现代审美的字体系统。',
    imageUrl: '/src/assets/jiaguwen1.png',
    author: '字体设计师',
    likes: 1890,
    tags: ['甲骨文', '字体', '文字设计'],
    type: 'history',
    views: 3890,
    comments: 76
  },
  {
    id: '10',
    title: '中国色·AI配色方案',
    description: '基于《中国传统色》理论训练AI模型，自动生成符合东方美学配色方案的设计工具。',
    imageUrl: '/src/assets/aipeise.png',
    author: '色彩研究者',
    likes: 4560,
    tags: ['中国色', 'AI工具', '配色'],
    type: 'digital',
    views: 6890,
    comments: 201
  }
];
