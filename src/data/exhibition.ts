export interface ReadingSection {
  heading: string;
  paragraphs: string[];
}

export interface Exhibit {
  id: string;
  title: string;
  image: string;
  alt: string;
  detailImage: string;
  detailAlt: string;
  caption: string;
  detailTint: string;
  reading: ReadingSection[];
  readingSource?: { label: string; url: string };
  keywords: string;
}

interface GallerySection {
  id: string;
  title: string;
  description: string;
  works: Exhibit[];
}

export const exhibitionTitle = '手艺的新形状';

export const homeThemes = [
  {
    section: 'traditional',
    title: '日常里的旧技艺',
    description: '从布上的纹路、戏台的衣褶，到纸上的墨迹。',
    image: '/images/zhijin-haibao.webp',
    alt: '几幅青绿与朱红的织锦交叠，丝线织成细密的波纹',
  },
  {
    section: 'modern',
    title: '近现代设计的材料实验',
    description: '看玻璃、金属和纸怎样成为设计的一部分。',
    image: '/images/collection/home-design-cover.webp',
    alt: '红色折纸、玻璃与金属样片摆在浅色工作台上',
  },
  {
    section: 'digital',
    title: '传统遇上数字创作',
    description: '从一幅青绿山水出发，想象它在新的媒介里怎样改变。',
    image: '/images/collection/home-digital-contours.webp',
    alt: '纸上的青绿山水从手绘笔触过渡为细密的数字等高线',
  },
];

export const gallerySections: GallerySection[] = [
  {
    id: 'traditional',
    title: '传统工艺',
    description: '从一笔、一刀和一件戏服，读出手艺中的时间。',
    works: [
      {
        id: '2', title: '烟雨与留白',
        image: '/images/collection/river-ink.webp', alt: '雨雾中的江面留出大片空白，乌篷船和岸边芦苇以深墨勾出',
        detailImage: '/images/collection/river-slope-detail.webp', detailAlt: '烟雨里一截石阶没入水中，系船桩旁的湖面几乎全是留白',
        caption: '近处的石阶用了最深的墨，往水里去的几级逐渐失去边缘。大片留白顺着水面向右铺开，只留下几圈雨纹。沿着石阶看过去，水和雾在哪里交接，也就留给了看画的人。',
        detailTint: '#797F92',
        reading: [
          {
            heading: '画到一半的边缘',
            paragraphs: [
              '从左下角看起，系船桩的断面很实，旁边的草叶却只用几根细线带过。石头让目光在岸边停下来，草尖又把它引向空处。若把湖岸一直描到底，视线就会跟着轮廓走。现在只画一截，目光反而会在没有画满的地方停一会儿。',
              '再把画面看得远一点。岸边石阶的深浅很容易分辨，远处的墨团却几乎不能逐一辨认。有的边看得见，有的刚要成形就散了，远近由此拉开。雨意从这些变化里慢慢出现。',
            ],
          },
          {
            heading: '让封面与展签隔水相望',
            paragraphs: [
              '封面从水面看过去，乌篷船是画里孤单的一点深墨。展签把视角移到岸边，船已经不在了，取而代之的是一截可以走下去的石阶。两张图把不同的观察位置放在一起，也留下了一段没有交代的时间。船是刚走，还是尚未靠岸？',
              '可以拿手遮住画面左下角，再松开，比较大片浅色在两种情况下给人的感觉。石阶一回来，纸上的浅色便有了方向和尺度。这里的留白依靠有分量的深处来成立。',
            ],
          },
        ],
        keywords: '江南 + 烟雨 + 桥头等船',
      },
      {
        id: '3', title: '戏服里的行当',
        image: '/images/collection/opera-costume.webp', alt: '后台木架上挂着青色长水袖戏服和带金绣的朱红戏服',
        detailImage: '/images/collection/opera-embroidery-detail.webp', detailAlt: '后台木案上叠放着朱红绣衣，象牙白水袖从一侧垂下',
        caption: '台上先看见的是衣袖划出的线条。到后台近看，朱红衣料上的密绣有分量，素色水袖却轻软。把它们放在一起，衣服怎样跟着身段动起来，就能从布料的褶皱里看出来。',
        detailTint: '#A45D56',
        reading: [
          {
            heading: '站在后台看戏服',
            paragraphs: [
              '戏服穿在身上时，观众先从远处读出轮廓与大块颜色。凑近木案，可以看见深红绣衣的边上缀着金线，翻折处露出较暗的里层，浅色袖料沿着桌边垂下。图里的深浅既来自颜色，也来自衣物堆叠和遮挡。',
              '试着顺着一条衣边看一圈。目光会在密绣的花纹上停片刻，再沿着浅色长袖向下走。舞台上的停顿与延伸，在衣服静置的时候也还看得见。',
            ],
          },
          {
            heading: '同一动作，两种落点',
            paragraphs: [
              '封面把两套戏服挂得很开，便于比较肩部、袍身和袖口的形状。到了展签，画面只留下衣物并排的局部，同一次抬手也会带来不同的变化。较挺的部分先撑出外轮廓，轻软的部分要等动作结束后才慢慢垂落。',
              '如果把这一幕写成故事，可以从开演前的一件小事入手。理衣的人先抚过有纹样的边，随后把长袖拢在臂弯里。两次触碰的轻重不同，角色上台之前的准备就有了可见的细节。',
            ],
          },
        ],
        keywords: '京剧 + 戏服 + 演出前的一面镜子',
      },
      {
        id: '9', title: '从刻痕到拓片',
        image: '/images/jiaguwen-cover.webp', alt: '一块有细小刻痕的骨片斜放在纸面上',
        detailImage: '/images/collection/oracle-rubbing.webp', detailAlt: '纸面上的深浅拓痕，旁边放着拓印工具',
        caption: '拓片把起伏的刻痕转成纸上的浓淡和边缘。在这张拓印习作里，可以沿着一个笔画的转折看，比较平整处和凹陷处如何留出不同的线条。',
        detailTint: '#9E795A',
        reading: [
          {
            heading: '纸为什么能留下凹痕',
            paragraphs: [
              '传拓先让薄纸贴着器物的表面，再在纸上轻轻上墨。以这张图所示的凹刻纹为例，较平的地方先受墨，凹下去的部分容易留下较浅的线。原来靠光线才能辨认的起伏，在纸上变成了可以并排、放大、反复比较的明暗关系。',
              '上墨的均匀程度也影响阅读。墨色太重，小刻痕容易和周围黏在一起。墨色过浅时，长笔画中断的地方又可能看不清。看拓片可以先认一条完整的线，再回过头找它两侧断续的墨点。',
            ],
          },
          {
            heading: '哪些痕迹要一起留下',
            paragraphs: [
              '有些白线像是笔画，有些则可能来自材料自身的裂纹或缺口。这张习作把深色部分的外缘也留了下来，让纹样、断口和纸纤维同时可见。如果只抽取一条干净的轮廓，读起来更便捷，但也少了一些判断刻痕如何依附在表面上的线索。',
              '封面让人先看见骨片的厚度和边缘，展签则把注意力放到纸上。来回比较两张图，找找侧光下才显出的细节到了纸上是什么样。没有被拓出来的厚度、颜色和反光，又有哪些是辨认材料时仍然需要的？',
            ],
          },
        ],
        readingSource: {
          label: '故宫博物院《响拓、颖拓、全形拓与金石传拓之异同》',
          url: 'https://img.dpm.org.cn/Uploads/File/2018/06/04/u5b152c3eb8e0b.pdf',
        },
        keywords: '骨片 + 拓印 + 一封无人能读的信',
      },
    ],
  },
  {
    id: 'modern',
    title: '近现代设计',
    description: '从色卡、玻璃窗和银饰的细部，观察材料怎样影响形式。',
    works: [
      {
        id: 'glass', title: '窗里的琥珀光',
        image: '/images/collection/glass-window.webp', alt: '方形金属框中的琥珀色与烟灰色玻璃，光斑投在地面',
        detailImage: '/images/collection/glass-detail.webp', detailAlt: '两片有纹理的琥珀色和灰色玻璃在细金属框处相接',
        caption: '整扇窗把色块排成有疏密的方格，细部则让人看见颜色从何而来。玻璃边缘的厚度、铸造时留下的小气泡，以及窄窄的接缝，都会稍微改变透过窗的那束光。',
        detailTint: '#C78A4D',
        reading: [
          {
            heading: '玻璃有正面，也有边',
            paragraphs: [
              '远看窗框，琥珀和烟灰像是两块平整的颜料。走近之后，色块里出现小气泡、粗细不一的纹理，以及沿着接缝聚起的高光。窗的轮廓由金属框划定，每一格内部却仍在变化，完整的几何构图因此有了可近读的细部。',
              '可以先盯住两片玻璃相接的位置，再把视线慢慢移向中间。边缘更容易出现一条深色带，中间透来的光则更散。视线稍一移动，同一格的明暗都会跟着变。',
            ],
          },
          {
            heading: '窗在地面上还有一幅画',
            paragraphs: [
              '封面里，光斑越过窗框落在地上。只要光线的角度变化，投下来的形状就会拉长或缩短，原来紧挨着的色块也可能分开。设计时既要看窗本身的比例，也可以试着把窗转向另一边，观察它怎样给房间添上一块颜色。',
              '近看的展签把镜头留在最窄的金属接缝上。那条线在窗里笔直而清楚，落到地面却可能只剩一小段模糊的暗痕。从接缝到光斑，两种截然不同的边缘来自同一件东西。',
            ],
          },
        ],
        keywords: '琥珀玻璃 + 老窗框 + 午后光斑',
      },
      {
        id: '7', title: '节气的配色练习',
        image: '/images/zhongguose-cover.webp', alt: '靛青、朱红、浅黄和灰绿色的手工纸色样',
        detailImage: '/images/jieqi-cover.webp', detailAlt: '稻穗、荷花与不同季节的枝叶并排出现',
        caption: '把节气先看成眼前的风物。稻穗接近干燥的米黄，荷花的粉色比叶色明亮，枝梢常常先转暖。从这些变化里取色，排出一组能看见季节交替的图卡。',
        detailTint: '#BB9166',
        reading: [
          {
            heading: '从一段变化里取色',
            paragraphs: [
              '给节气配色时，可以先收集同一个地方在不同日子里的细节。比如选一张有新叶的照片，再选一张同一处的枯叶，两张都取叶缘和透光处的颜色。把样本并排放好，才容易看出究竟是色相变了，还是原来的绿色只是褪得更浅。',
              '展签把花、稻穗和不同形态的枝叶排在一起。花瓣上的粉色只适合做很小的一笔，穗子和干叶却能承托一大片背景。取到了相近的颜色之后，怎样分配每种颜色的面积，仍然会改变整张图卡的冷暖。',
            ],
          },
          {
            heading: '把一年的色卡排成一列',
            paragraphs: [
              '可以先画三张同样大小的图卡，让前后两张共用一块底色，只换掉一小块装饰色。另一种排法是换掉中间那张的底色，让季节之间出现一道明显的分界。比较两种安排，想想哪一种更接近你记得的时节。',
              '封面上的手工纸提醒我们，材料的肌理本身也会带来深浅。同一个色样在平滑屏幕和粗纸上看起来未必一样。做完配色之后，把样张放到窗边再看一次，往往还能找到需要留白的地方。',
            ],
          },
        ],
        keywords: '二十四节气 + 色卡 + 等待春天的人',
      },
      {
        id: '8', title: '银的当代形态',
        image: '/images/miaozu-cover.webp', alt: '由蝴蝶和花朵部件组成的银色装饰',
        detailImage: '/images/collection/silver-detail.webp', detailAlt: '银色蝶翅、细线叶片和垂件放在灰色毡面上',
        caption: '先把视线从完整形态移到几个小部件上。刻过的银片让光集中在纹路边缘，编成叶形的金属丝则留下间隙，垂件会随身体移动。分开观察这些效果，就能想象它们怎样组合进新的佩戴方式。',
        detailTint: '#837E9A',
        reading: [
          {
            heading: '三种部件，三种受光',
            paragraphs: [
              '把银色饰件搁在哑光的灰毡上，有了一个安静的参照。蝶翅反射的光顺着刻纹散开，线编的叶片透出背后的灰毡，小垂件上的光则缩成几个亮点。它们用相近的颜色，形态仍然看得出轻重。',
              '如果把光从侧面挪到上方，可以设想哪一处最先变亮，哪一处的间隙仍然清楚。观察这样微小的差异，有助于理解金属设计怎样用厚薄和形状做出层次。',
            ],
          },
          {
            heading: '从完整轮廓拆回佩戴的动作',
            paragraphs: [
              '封面完整展示了花、蝶和垂件的组合，展签把最小的连接处放大。小圆环的位置决定垂件悬挂在哪里，也影响它摆动的幅度。固定住部件，外轮廓会稳定下来。留出活动的接点，光就可能随着动作跳到不同位置。',
              '尝试把蝶翅想成一个胸针，再想成帽饰的一部分。同一块刻纹面所面对的观看距离和光照方向都变了，附在边缘的垂件也需要重新安排。新的用途可以从重新考虑一个连接点开始。',
            ],
          },
        ],
        keywords: '银片 + 蝶翅 + 一枚会传下去的礼物',
      },
    ],
  },
  {
    id: 'digital',
    title: '传统与数字',
    description: '让投影、数字建模和 AI 辅助配色进入传统图像的创作过程。',
    works: [
      {
        id: '5', title: '影偶的数字舞台',
        image: '/images/collection/digital-shadow.webp', alt: '展厅中的镂空皮影和放大投在幕布上的影子',
        detailImage: '/images/collection/digital-shadow-detail.webp', detailAlt: '灯光穿过薄薄的皮影镂空，两层影子在纸幕上错开',
        caption: '皮影上的镂空把一束光拆成许多细小形状。近看纸幕，两层光从不同角度落在同一个影偶上，影子的边缘就错开了。可以再用数字投影慢慢移动其中一层，观察留在幕上的轮廓怎样变化。',
        detailTint: '#A06C4B',
        reading: [
          {
            heading: '幕布把形状留了下来',
            paragraphs: [
              '单看影偶，可以注意到轮廓上有完整的弧线，内部还留下许多窄小的开口。到了幕上，外形先被认出来，镂空的花纹要等目光适应光亮之后才渐渐浮现。大轮廓让人辨认影偶的位置，内侧的纹样则让人有理由多看一会儿。',
              '可以在脑中把影偶稍稍移开幕布。光源的位置固定时，投下来的边界可能变大，也可能失去原来的锐度。皮影和幕的距离改变一点，即使影偶本身不动，画面也会有不同的分量。',
            ],
          },
          {
            heading: '给第二层影子留一个位置',
            paragraphs: [
              '想象幕上同时有实物的投影和一层数字轮廓。两层影子完全重合时，细节叠在一起。让其中一层慢一点跟上，两个动作之间就能看见时间差。副影太亮会抢走主影的位置，于是可以在亮度、偏移量和出现时间之间逐项试出平衡。',
              '封面把幕和周围的黑暗都留在画里，展签则贴近那道分岔的边缘。前者让人知道戏发生在哪里，后者让人看见，即便只移动一层影子，原来静止的空间也会出现前后关系。',
            ],
          },
        ],
        keywords: '皮影 + 双重影子 + 幕后的最后一盏灯',
      },
      {
        id: '4', title: '青铜纹样的数字拆解',
        image: '/images/collection/bronze-layer-cover.webp', alt: '石台上的青铜器与前方玻璃上的纹样轮廓相互对应',
        detailImage: '/images/collection/bronze-layer-detail.webp', detailAlt: '同一纹样分别呈现在青铜残片、绿色浮雕和浅灰描线板上',
        caption: '把同一块纹样放到三种样片上看。左边保留了铜面的磨损和凹槽，中间把起伏提炼成浮雕，右边只留下轮廓。这样分层之后，可以一眼看出哪些曲线决定造型，哪些深浅只在光照下才显出区别。',
        detailTint: '#698578',
        reading: [
          {
            heading: '从器身上找对称关系',
            paragraphs: [
              '在整件器形上看纹饰时，可以先寻找左右相向的两个卷曲，再从中间画一条想象中的轴。沿着这条轴比较两侧，能找出重复的轮廓，也能留意哪些线到了弧形器壁上就看起来更窄。把器壁展开之前，先认识这种由观看角度带来的变化。',
              '封面里玻璃板只抽取了一部分线条，恰好让人把明暗很多的铜面与一组干净的轮廓对在一起。对着看时，图形有哪些转弯、在哪儿变粗，比盯着整件器物时更容易辨认。',
            ],
          },
          {
            heading: '建模时留下哪一层',
            paragraphs: [
              '纹样做成数字模型，可以让轮廓、浮雕高度和材质记录分别控制。只显示轮廓时，容易检查纹样单元能否衔接。加回高度后，可以用侧光看突起是否会遮盖较浅的沟槽。最后放回表面纹理，观察锈色和磨损怎样改变局部的明暗。',
              '展签上的三块样片是这种拆法的一种示意。先看中间与右边，再看左边，就能感觉到线稿便于比较形式，铜面却提供了线稿没有保留的时间感。需要复制纹样时和想研究原材料时，适合留下的层次也会不同。',
            ],
          },
        ],
        keywords: '青铜器 + 纹样层叠 + 灯下的遗物',
      },
      {
        id: '6', title: '从青绿到像素',
        image: '/images/collection/pixel-landscape-cover.webp', alt: '低饱和的青绿像素方格排成雾中的山岭和水面',
        detailImage: '/images/collection/pixel-print-detail.webp', detailAlt: '印样放大了两层山脊的像素边缘，旁边有一条独立色样',
        caption: '沿着印样的山脊近看，原本连成一线的轮廓变成一格一格的台阶。下方色样把青、绿、靛和纸白单独列出来。选好有限的色阶之后，只要换掉交界处的几格，前后两层山的距离就会跟着改变。',
        detailTint: '#6F92A9',
        reading: [
          {
            heading: '先定前后，再决定格子大小',
            paragraphs: [
              '把青绿山水放进方格里，可以先画山势的几层远近。近山用较连贯的深色块，远山则把相近的浅色排开，只在最需要辨认的地方保留一点边界。即使不去画树和石头，层次也能靠颜色的先后关系站住。',
              '直接减掉一半格子试试看。弯曲的山脊会开始显出折角，有些小岔口会消失，最显眼的起伏却可能更容易被记住。挑选格子的尺寸，也是决定哪些地形要留下的过程。',
            ],
          },
          {
            heading: '把屏幕上的青绿放到纸面',
            paragraphs: [
              '展签把视线拉到印样和旁边的色条。纸纤维使每个边缘都带着一点细碎的纹理，浅色一格接着一格退进纸白时，远山仍能像在起雾。若把交界处的深色格再推近一列，两层山就会变得更像贴在一起。',
              '排色时可以让 AI 帮忙提出几组候选色，但最后仍要把颜色放回同一张图里试。把整幅图缩到很小，看看远山在不在，再放大检查边缘有没有多余的阶梯。远看和近看会给出两种不同的修改理由。',
            ],
          },
        ],
        keywords: '青绿山水 + 色阶 + 山间的旅行者',
      },
    ],
  },
];

export const exhibitionWorks = gallerySections.flatMap(section => section.works);
export const findExhibit = (id: string | null | undefined) => exhibitionWorks.find(work => work.id === id);

export const formerExhibitDestinations = new Map([
  ['1', '/exhibitions#digital'],
  ['10', '/exhibitions/7'],
  ['loom', '/exhibitions#traditional'],
  ['indigo', '/atlas/indigo'],
  ['embroidery', '/atlas/embroidery'],
  ['bamboo', '/atlas/bamboo'],
  ['thread', '/exhibitions#modern'],
  ['paper', '/exhibitions#modern'],
]);

export interface CraftEntry {
  id: string;
  title: string;
  region: string;
  image: string;
  imageAlt: string;
  detailImage: string;
  detailAlt: string;
  summary: string;
  introduction: string;
  detailTint: string;
  reading: ReadingSection[];
  process: { title: string; text: string }[];
  sourceUrl: string;
}

export const craftEntries: CraftEntry[] = [
  {
    id: 'indigo',
    title: '南通蓝印花布',
    region: '江苏南通',
    image: '/images/collection/atlas-indigo.webp',
    imageAlt: '折好的蓝白花布和木刮板放在木桌上',
    detailImage: '/images/collection/atlas-indigo-detail.webp',
    detailAlt: '工作台上正在用镂空花版给白棉布刮浆，旁边放着蓝印样布',
    summary: '从一块镂空花版，看蓝布上的白花怎样留下来。',
    introduction: '棉布上白色的部分在入缸之前就已经决定了。花版将防染浆带到布面，浆层挡住靛蓝，最后露出棉布本来的颜色。',
    detailTint: '#55729C',
    reading: [
      {
        heading: '从一方花版开始',
        paragraphs: [
          '在染之前，工匠首先要决定布的哪里留白。铺在白布上的镂空花版，决定防染浆能从哪些地方透过去。传统做法可用黄豆粉和石灰调浆。浆层干后入染，等布晾好再刮浆，原先盖住的布面便显露出来。翻看工序图，可以顺着白布、花版和刮具还原这几步动作。',
          '设计花版时，要兼顾好看和可刻。一个由许多细部组成的花样，适合分成若干可辨认的块面，再在它们之间留出空隙。花版在布上多次移动时，那些空隙也会跟着重复，形成比单朵花更容易看出的节奏。',
        ],
      },
      {
        heading: '一块布要怎样用',
        paragraphs: [
          '在南通一带，蓝印花布曾做成被面、包袱和头巾。花草、飞鸟和几何纹样都可以放进家用织物。被面摊开时能看到中间和边角怎样相接，包袱布打起结来，显眼的可能只剩下某一角的花。看花布时，想一想它会怎样铺开、折拢和系紧，图案的位置就有了理由。',
          '还可以沿着一行花纹慢慢看，找相邻图案之间的接缝，再观察同一块布上深色与浅色的位置。远看认重复的秩序，近看浆印和布纹，你就能把一块花布看出两个尺度。',
        ],
      },
    ],
    process: [
      { title: '刻版', text: '把预定留白的地方刻成镂空纹样。铺版时留心纹样单元的起点，便于下一次移动花版时对齐。' },
      { title: '刮浆', text: '用刮板把防染浆推过花版，让浆均匀进入镂空处。抬起花版后平放布面，等浆层干透。' },
      { title: '染与刮', text: '把上过浆的布浸染、晾干，再去掉表面的浆。此时白纹和蓝底才完整出现，可以检查边缘是否清楚。' },
    ],
    sourceUrl: 'https://www.ihchina.cn/art/detail/id/11430.html',
  },
  {
    id: 'embroidery',
    title: '苏绣',
    region: '江苏苏州',
    image: '/images/collection/atlas-embroidery.webp',
    imageAlt: '不同色泽的丝线与绣架摆在工作面上',
    detailImage: '/images/collection/atlas-embroidery-detail.webp',
    detailAlt: '绣面上的叶脉与丝线，能看见针脚方向随叶片转折而改变',
    summary: '沿着丝线的走向，看针法如何画出明暗和轮廓。',
    introduction: '绣面上的明暗一部分来自丝线的颜色，一部分来自丝线反光的方向。顺着叶片的针路观察，能看见图案如何从一束束细线里显现。',
    detailTint: '#859369',
    reading: [
      {
        heading: '在丝线上安排光',
        paragraphs: [
          '从图里的叶脉往外看，丝线随着叶片伸展并逐步转向。叶脉附近的针脚把视线引向叶尖，到了外缘，短线和留出的空白把轮廓收住。同一片叶子的深浅可以由多种绿色共同完成，也可以通过改变落针方向，让相近的丝色看起来有了不同的亮度。',
          '拿同一件绣品换个角度看，有些先前亮起来的线束会暗下去。近看时可以留意针脚怎样错开，退回正面时再观察它们能否合成完整的一片颜色。这种在整体和局部之间反复比较的方式，很适合读苏绣。',
        ],
      },
      {
        heading: '针法的变化也有来历',
        paragraphs: [
          '苏绣得名于苏州。清代丁佩把刺绣经验写进《绣谱》。到了近代，沈寿借仿真绣表现物象的体积和明暗，杨守玉又发展出乱针绣，让不同方向、不同颜色的线交叠起来。面对类似的画稿，不同针路能得出很不一样的绣面。',
          '读一件绣品时，除了问用了什么针法，还可以问为什么偏偏在那里换针路。把叶片、枝茎和背景分别观察，会发现有的线在描形，有的线在调色，还有的线只为让两块颜色自然接在一起。',
        ],
      },
    ],
    process: [
      { title: '看针路', text: '观察线在转折处朝哪个方向走。同一片叶子上的丝线，也可以有不同的走向。' },
      { title: '看设色', text: '看深浅不同的丝线怎样交替，图案的明暗便从线与线的交界处过渡出来。' },
      { title: '换角度', text: '侧着看绣面，留意丝线反光的变化。正面看到的层次，可能在侧光下显得更清楚。' },
    ],
    sourceUrl: 'https://www.ihchina.cn/project_details/13978',
  },
  {
    id: 'bamboo',
    title: '道明竹编',
    region: '四川崇州',
    image: '/images/collection/atlas-bamboo.webp',
    imageAlt: '日光下并排摆放的镂空竹篮和密编竹筒',
    detailImage: '/images/collection/atlas-bamboo-detail.webp',
    detailAlt: '竹篮口沿细部，窄篾上下交错并包住弧形边框',
    summary: '从一根篾条到一只器物，认识交织、起形和收口。',
    introduction: '篮子的边缘是手艺最容易被看见的地方。竹篾经过转向，在口沿被收紧和固定，器物的形状与表面的纹路就在这里连起来。',
    detailTint: '#AD9061',
    reading: [
      {
        heading: '同一根竹子，能做出几种篾',
        paragraphs: [
          '道明竹编以四川崇州道明一带生长的慈竹为原料。竹材去青去节后，还要继续分成适合编织的片和丝。粗的篾片可以撑住器形，细的篾丝则更便于转弯和织出密纹。备多少种粗细，取决于接下来要做的器物，以及各处要承受怎样的拉力。',
          '图鉴封面的竹篮和竹筒给了一个并排观察的机会。篮上的孔隙让光直接透进来，筒壁较密，阴影便成了大片。辨认疏密之后，还可以再看篾片从底部转到侧壁时是怎样换方向的。',
        ],
      },
      {
        heading: '最后几根篾决定边沿的手感',
        paragraphs: [
          '道明竹编常以经纬交错来织出器形，也会穿插、锁合或扎结。器身编到口沿时，伸出来的篾头需要折回或压进边框。展签的局部适合顺着一根篾寻找它的去向，看看这根篾在哪里离开平纹，又在哪里借着另一根篾固定下来。',
          '留意口沿与器身的差别。网眼上的节奏来自一段段重复交织，边沿则要握起来顺手，还得能承受翻动和提拿。看这一圈收口，就可以同时理解竹编的装饰和用途。',
        ],
      },
    ],
    process: [
      { title: '制篾', text: '将竹材加工成适合编织的细条，粗细不同的篾条可以承担不同的结构。' },
      { title: '编身', text: '通过编织形成平面纹样，并调整篾条的方向，搭出器身的形状。' },
      { title: '收口', text: '整理器物的边沿、节点与连接处，使各部分连成完整器形。' },
    ],
    sourceUrl: 'https://www.ihchina.cn/project_details/14084.html',
  },
];
