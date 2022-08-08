/**
 * 提示：JS版本的配置文件可参考：config.js
 */
import nav from './config/nav'
import { resolve } from 'path'
import { defineConfig4CustomTheme, UserPlugins } from 'vuepress/config'
import { VdoingThemeConfig } from 'vuepress-theme-vdoing/types'
import dayjs from 'dayjs'
import baiduCode from './config/baiduCode' // 百度统计hm码

export default defineConfig4CustomTheme<VdoingThemeConfig>({
  //theme: 'vdoing', // 使用npm包主题
  theme: resolve(__dirname, '../../theme-vdoing'), // 使用本地主题

  locales: {
    '/': {
      lang: 'zh-CN',
      title: "洛理指南",
      description: '各种指南，应有尽有！这儿就是咱的家了',
    }
  },
  base: '/docs/', // 默认'/'。

  // 主题配置
  themeConfig: {
    // 导航配置
    nav,
    sidebarDepth: 3, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
    logo: 'https://image.gaoajia.com/i/2021/10/28/d7b19b2e89822.png', // 导航栏logo
    repo: 'lit-lug/LuoLi-Guide', // 导航栏右侧生成Github链接
    searchMaxSuggestions: 10, // 搜索结果显示最大数
    lastUpdated: '上次更新', // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)
    docsDir: 'docs', // 编辑的文件夹
    editLinks: true, // 启用编辑
    editLinkText: '编辑',

    //*** 以下是Vdoing主题相关配置***//

    category: false, // 分类功能
    tag: false, // 标签功能
    archive: false, // 归档功能
    // categoryText: '随笔', // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'

    // bodyBgImg: [
    //   'https://image.iluoli.ren/2021/11/17/3910677424f4a.jpg',
    //   'https://image.iluoli.ren/2021/11/17/5a892c74a2112.jpg',
    // ], // body背景大图，默认无。 单张图片 String | 多张图片 Array, 多张图片时每隔15秒换一张。
    // bodyBgImgOpacity: 0.5, // body背景图透明度，选值 0.1~ 1.0, 默认0.5
    // titleBadge: false, // 文章标题前的图标是否显示，默认true
    // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
    //   '图标地址1',
    //   '图标地址2'
    // ],
    contentBgStyle: 6, // 文章内容块的背景风格，默认无. 1 方格 | 2 横线 | 3 竖线 | 4 左斜线 | 5 右斜线 | 6 点状

    updateBar: { // 最近更新栏
      showToArticle: false, // 显示到文章页底部，默认true
      moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
    },
    // rightMenuBar: false, // 是否显示右侧文章大纲栏，默认true (屏宽小于1300px下无论如何都不显示)
    // sidebarOpen: false, // 初始状态是否打开左侧边栏，默认true
    // pageButton: false, // 是否显示快捷翻页按钮，默认true

    // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | <自定义>    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页
    sidebar: 'structuring',
    //新建文档时front matter中额外添加的字段
    extendFrontmatter: {
      comment: false ,
      sidebar: true ,
      article: false
    },
    // 文章默认的作者信息，(可在md文件中单独配置此信息) string | {name: string, link?: string}
    author: {
      name: 'AjiaErin', // 必需
      link: 'https://www.gaoajia.com', // 可选的
    },
    // 社交图标 (显示于博主信息栏和页脚栏。内置图标：https://doc.xugaoyi.com/pages/a20ce8/#social)
    social: {
      // iconfontCssFile: '//at.alicdn.com/t/xxx.css', // 可选，阿里图标库在线css文件地址，对于主题没有的图标可自己添加。阿里图片库：https://www.iconfont.cn/
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
          link: 'https://github.com/lit-lug/LuoLi-Guide'
        }
      ],
    },

    // 页脚信息
    footer: {
      createYear: 2022, 
      copyrightInfo: '<a href="https://iluoli.ren" target="_blank" title="洛理指南" >LIT LUG</a> | MIT License',
    },
  },
  
  // 注入到页面<head>中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }], //favicons，资源放在public文件夹
    ['script', { src: 'https://cdn.gaoajia.com/Twikoo/twikoo.all.min.js' }],//自建twikoo cdn 当前版本1.6.3
    [
      'meta',
      {
        name: '洛理指南',
        content: '洛阳理工学院,洛理指南,洛理LUG,LITLUG',
      },
    ],
    ['meta', { name: 'baidu-site-verification', content: 'zYKJSR1u0N' }], // 百度统计的站长验证
    ['meta', { name: 'theme-color', content: '#11a8cd' }], // 移动浏览器主题颜色
    // [
    //   'script',
    //   {
    //     'data-ad-client': 'ca-pub-xxxxxxxxxxxxxxxxxxx',
    //     async: 'async',
    //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    //   },
    // ], // 网站关联Google AdSense 与 html格式广告支持
  ],


  // 插件配置
  plugins: <UserPlugins>[

    'vuepress-plugin-baidu-autopush', // 百度自动推送

    [
      'vuepress-plugin-baidu-tongji', // 百度统计
      {
        hm: baiduCode,
      },
    ],

    // 全文搜索：vuepress-plugin-thirdparty-search
    'fulltext-search',


    [
      'one-click-copy', // 代码块复制按钮
      {
        copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
        copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
        duration: 1000, // prompt message display time.
        showInMobile: false, // whether to display on the mobile side, default: false.
      },
    ],

    [
      'demo-block', // demo演示模块 https://github.com/xiguaxigua/vuepress-plugin-demo-block
      {
        settings: {
          // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
          // cssLib: ['http://xxx'], // 在线示例中的css依赖
          // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
          jsfiddle: false, // 是否显示 jsfiddle 链接
          codepen: true, // 是否显示 codepen 链接
          horizontal: false, // 是否展示为横向样式
        },
      },
    ],
    [
      'vuepress-plugin-zooming', // 放大图片
      {
        selector: '.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
        options: {
          bgColor: 'rgba(0,0,0,0.6)',
        },
      },
    ],
    [
      {
          name: 'custom-plugins',//评论
          globalUIComponents: ["Twikoo"],// 2.x 版本 globalUIComponents 改名为 clientAppRootComponentFiles
      }
    ],
    [
      '@vuepress/last-updated', // "上次更新"时间格式
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
        },
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // 提取标题到侧边栏的级别，默认['h2', 'h3']
  },
  

  // 监听文件变化并重新构建
  extraWatchFiles: [
    '.vuepress/config.ts',
    '.vuepress/config/htmlModules.ts',
  ]
})
