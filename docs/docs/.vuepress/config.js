// 此文件仅做参考备份使用，！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！


//！！！！！！！！！！！！！！！！！！！
//



/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!


const nav = require('./config/nav.js');
const base = require('../../base.js');
const htmlModules = require('./config/htmlModules.js');
const feed_options = {
  canonical_base: 'https://www.iluoli.ren',
};

module.exports = {
  title: "洛理指南",
  description: 'Luoyang Institute of Science and Technology Linux User Group',
  base: "/docs/", // '/<仓库名>/'， 默认'/'
  head: [ // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
    ['link', { rel: 'icon', href: '/img/64x64.png' }], //favicons，资源放在public文件夹
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'keywords', content: 'vuepress,theme,blog,vdoing'}],
    ['meta', { name: 'theme-color', content: '#ffffff'}], // 移动浏览器主题颜色
    ],

    // 以下是vuepress-plugin-demo-block插件所需依赖
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }], // 此文件会影响导航router-link-active样式的切换，改为在enhanceApp.js中把Vue构造函数绑定到window上
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }],
  //],
  markdown: {
    lineNumbers: true // 代码行号
  },
  // theme: 'vdoing', // 使用依赖包主题
  theme: require.resolve('../../theme-vdoing'), // 使用本地主题
  themeConfig: { // 主题配置
    nav,
    sidebarDepth: 3, // 侧边栏显示深度，默认1，最大2（显示到h5标题）
    logo: 'https://image.gaoajia.com/2021/10/28/d7b19b2e89822.png', // 导航栏logo
    repo: 'lit-lug/LuoLi-Guide', // 导航栏右侧生成Github链接
    searchMaxSuggestions: 10, // 搜索结果显示最大数
    lastUpdated: '上次更新', // 更新的时间，及前缀文字   string | boolean (取值为git提交时间)

    docsDir: 'docs', // 编辑的文件夹
    editLinks: true, // 编辑链接
    editLinkText: '编辑',

    // 以下配置是Vdoing主题改动的和新增的配置
    sidebar: { mode: 'structuring', collapsable: false }, // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | 自定义    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页

    sidebarOpen: true, // 初始状态是否打开侧边栏，在侧边栏关闭状态下，页面向下滚动时会隐藏顶部导航栏，让用户更专注于阅读。可以通过 front matter 来禁用指定页面的侧边栏。默认禁用。
    updateBar: { // 最近更新栏
      showToArticle: true, // 显示到文章页底部，默认true
      moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
    },
    titleBadge: true, // 文章标题前的图标是否显示，默认true
    // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
    //   '图标地址1',
    //   '图标地址2'
    // ],
    // bodyBgImg: [
    //   'https://image.iluoli.ren/2021/11/17/3910677424f4a.jpg',
    //   'https://image.iluoli.ren/2021/11/17/5a892c74a2112.jpg',
    // ], // body背景大图，默认无。 单张图片 String || 多张图片 Array, 多张图片时每隔15秒换一张。
    // bodyBgImgOpacity: 0.7, // body背景图透明度，选值 0 ~ 1.0, 默认0.5
    // categoryText: '随笔', // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'

    contentBgStyle: 6, // 文章内容块的背景底纹，选值：1 => 方格 | 2 => 横线 | 3 => 竖线 | 4 => 左斜线 | 5 => 右斜线 | 6 => 点状
    category: true, // 是否打开分类功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含分类字段 2.页面中显示与分类相关的信息和模块 3.自动生成分类页面（在@pages文件夹）。如关闭，则反之。
    tag: true, // 是否打开标签功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含标签字段 2.页面中显示与标签相关的信息和模块 3.自动生成标签页面（在@pages文件夹）。如关闭，则反之。
    archive: true, // 是否打开归档功能，默认true。 如打开，会做的事情有：1.自动生成归档页面（在@pages文件夹）。如关闭，则反之。

    author: { // 文章默认的作者信息，可在md文件中单独配置此信息 String | {name: String, href: String}
      name: 'AjiaErin', // 必需
      href: 'https://www.gaoajia.com' // 可选的
    },
    social:{ // 社交图标，显示于博主信息栏和页脚栏
      // iconfontCssFile: '//at.alicdn.com/t/font_1678482_u4nrnp8xp6g.css', // 可选，阿里图标库在线css文件地址，对于主题没有的图标可自由添加
      icons: [
        {
          iconClass: 'icon-QQ',
          title: '联系维护人员QQ',
          link: 'http://wpa.qq.com/msgrd?v=3&uin=2949970175&site=qq&menu=yes' 
        },
        {
          iconClass: 'icon-youjian',
          title: '意见反馈邮件',
          link: 'mailto:icpove@litunix.org'
        },
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/lit-lug/LuoLi-Guide-wiki'
        }
      ]
    },
    footer:{ // 页脚信息
      createYear: 2022, // 创建年份
      copyrightInfo: '<a href="https://iluoli.ren" target="_blank" title="洛理指南" >LIT LUG</a> | MIT License', // 版权信息，支持a标签
    },
    htmlModules,
  },
  plugins: [
    ['thirdparty-search', { // 可以添加第三方搜索链接的搜索框（原官方搜索框的参数仍可用）
      thirdparty: [ // 可选，默认 []
        {
          title: '在 Google 搜索 ',
          frontUrl: 'https://www.google.com/search?q=', // 搜索链接的前面部分
          behindUrl: '' // 搜索链接的后面部分，可选，默认 ''
        },
        {
          title: '在 Baidu 搜索',
          frontUrl: 'https://www.baidu.com/s?ie=UTF-8&wd=',
        },
        {
          title: '在 Bing 搜索',
          frontUrl: 'https://cn.bing.com/search?q='
        }
      ]
    }],
    ['one-click-copy', { // 代码块复制按钮
      copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
      copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
      duration: 1000, // prompt message display time.
      showInMobile: false // whether to display on the mobile side, default: false.
    }],
    ['demo-block', { // demo演示模块 https://github.com/xiguaxigua/vuepress-plugin-demo-block
      settings: {
        // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
        // cssLib: ['http://xxx'], // 在线示例中的css依赖
        // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
        jsfiddle: false, // 是否显示 jsfiddle 链接
        codepen: true, // 是否显示 codepen 链接
        horizontal: false // 是否展示为横向样式
      }
    }],
    [
      'vuepress-plugin-zooming', // 放大图片
      {
        selector:'.theme-vdoing-content img:not(.no-zoom)',
        options: {
          bgColor: 'rgba(0,0,0,0.6)'
        },
      },
    ],
    [
      '@vuepress/last-updated', // "上次更新"时间格式
      {
        transformer: (timestamp, lang) => {
          const dayjs = require('dayjs') // https://day.js.org/
          return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
        },
      }
    ]
  ],
  // configureWebpack: {
  //   //webpack别名 如![Image from alias](~@alias/image.png)
  //   resolve: {
  //     alias: {
  //       '@alias': 'path/to/some/dir'
  //     }
  //   }
  // }
}
