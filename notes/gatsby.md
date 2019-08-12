# Gatsby Note

links:

- [gatsby-step-by-step](https://github.com/baurine/gatsby-step-by-step)
- [try-gatsby](https://github.com/baurine/try-gatsby)
- [gatsby blog](https://github.com/baurine/gatsby-blog)
- [why gatsby blazing fast](https://baurine.netlify.com/2019/06/05/why-gatsby-blazing-fast/)

## Gatsby Theme

- [官网文档](https://www.gatsbyjs.org/docs/themes/)
- [官网教程](https://www.gatsbyjs.org/tutorial/theme-tutorials/)
- [egghead - Gatsby Theme Authoring](https://egghead.io/courses/gatsby-theme-authoring)
- [Building a Theme](https://www.gatsbyjs.org/tutorial/building-a-theme/)

其实很好理解啦。之前的开发流程，通过一个 starter 初始化项目后，新的项目就和 starter 断开联系了，如果 starter 有更新，你的项目没办法与之同步。

theme 就是把原来的 starter 转变为一个 npm package，作为一个 gatsby 项目的依赖，当这个 theme 有更新时，项目也可以随时更新这个依赖。

在此基本上又创造出 theme starter 的概念，用来替代原来的 starter，它相比原来的 starter，非常轻量级，仅仅是为你的项目初始化了依赖了哪些 theme 及一些额外的简单配置。(其实个人认为这个 theme starter 没有存在的必要，会让使用者迷惑，直接用 `gatsby new` 生成一个所有项目都通用的 scaffold 即可，里面有一个默认的 theme，然后你可以根据需要替换掉这个默认的 theme。)

就这么简单理解就行了，初始阶段先学习怎么使用 theme 就行，后面再深入学习如何自己写一个 theme (egghead 上有相应的课程)。

在 github 上看到几个很酷炫的 gatsby theme 了，可以考虑在自己的 site 上用一下这些 theme。

PS: 从上面的官方文档上学习到了 `yarn workspace` 命令的用法，如何在一个 node.js 项目中管理多个子项目。

### egghead - Gatsby Theme Authoring

- [egghead - Gatsby Theme Authoring](https://egghead.io/courses/gatsby-theme-authoring)

先跳过。

## MDX

- [官网文档](https://www.gatsbyjs.org/docs/mdx/)

Gatsby 支持 mdx
