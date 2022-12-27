<p align='center'>
<img src='./public/favicon.png' width='192' height='192' />
</p>

<p align='center'>
    <a href="https://github.com/meetqy/eagleuse/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/meetqy/eagleuse"/>
    </a>
    <a href="https://www.typescriptlang.org" target="_black">
        <img src="https://img.shields.io/badge/language-TypeScript-blue.svg" alt="language">
    </a>
</p>

<p align='center'>
    <a href='https://rao.pics'>Online</a>
</p>

# 🦑 EagleUse

把 eagle 变成我的图片（后台）管理系统。

> 如果你也有这样的想法：eagle 修改/管理图片 => 网站上能实时查看。那这个项目非常合适，欢迎体验！

# 👀 介绍

**高度还原 Eagle**
![](./readme/1.jpg)

**可视化数据展示**
![](./readme/2.jpg)

**更好的数据管理及迁移**
![](./readme/3.jpg)

# 🚀 本地安装

```sh
git clone https://github.com/meetqy/eagleuse
pnpm install
```

把 .env.example 改为 .env，正确填写配置信息

```sh
# 初始化 数据库
pnpm run db:init

# 创建静态资源软连接
pnpm run create:symlink

# 启动项目
pnpm run dev
```

# 📚 功能列表

### 基础功能

- 监听 library 生成对应的 sqlite 数据
- sqlite 数据文件可视化展示
- 基于 prisma，更加简单的使用
- library 静态资源托管

### 页面

- 左侧菜单
- 等高展示图片
- 标签展示并显示图片数量
- 图片基础信息
- 查看原图

# 📄 开源协议

[MIT license](https://github.com/meetqy/eagleuse/blob/master/LICENSE) © [eagleuse](https://github.com/eagleuse)
