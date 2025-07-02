# 使用指南

## 网站概述

这是一个基于 [Docusaurus 2](https://docusaurus.io/) 构建的文档网站，用于现代 C++ 算法编程教程。本指南将帮助您了解如何使用和管理此网站。

## 开始使用

### 本地开发

要在本地启动开发服务器，请执行以下命令：

```bash
cd web
npm install   # 安装依赖（仅首次运行或依赖更新时需要）
npm start     # 启动开发服务器
```

这将启动本地开发服务器，通常在 [http://localhost:3000](http://localhost:3000) 上可访问。

### 构建静态网站

要构建静态网站文件，请运行：

```bash
cd web
npm run build
```

构建的静态文件将位于 `web/build` 目录中。

## 内容编辑

### Markdown 文件结构

所有文档内容都存储在 `web/docs/` 目录中的 Markdown (.md) 文件中。Markdown 文件包含两部分：

1. **前端元数据**：位于文件顶部，使用 YAML 格式的 frontmatter
2. **内容**：使用 Markdown 语法编写的实际内容

示例：

```md
---
id: getting-started
title: 入门指南
sidebar_label: 入门
slug: /getting-started
---

这里是文档内容，使用 Markdown 格式...
```

### 创建新文档

要创建新文档：

1. 在 `web/docs/` 目录或其子目录中创建新的 `.md` 文件
2. 添加适当的 frontmatter 信息
3. 编写文档内容
4. 在 `sidebars.js` 文件中添加文档引用（如果需要在侧边栏显示）

### Frontmatter 配置项

常用的 frontmatter 配置项包括：

- `id`: 文档的唯一标识符
- `title`: 文档标题，显示在页面顶部
- `sidebar_label`: 在侧边栏中显示的名称（可选，默认为 title）
- `slug`: 文档的 URL 路径
- `position`: 控制文档在侧边栏中的排序位置
- `hide_title`: 设置为 true 时隐藏页面顶部的标题
- `description`: 文档的简短描述，用于 SEO

### Markdown 语法

Docusaurus 支持标准 Markdown 语法，并有一些扩展功能：

#### 基础格式

```md
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
~~删除线文本~~

- 无序列表项
- 另一个列表项
  - 嵌套列表项

1. 有序列表项
2. 另一个有序列表项

> 引用文本
```

#### 链接和图片

```md
[链接文本](URL)
[内部链接](../other-doc)

![图片描述](/img/example.png)
```

对于内部链接，可以使用相对路径链接到其他文档。

#### 代码块

```md
​```javascript
// 这是 JavaScript 代码
function hello() {
  console.log('Hello, world!');
}
​```

​```cpp
// 这是 C++ 代码
#include <iostream>

int main() {
  std::cout << "Hello, world!" << std::endl;
  return 0;
}
​```
```

#### 提示框（Admonitions）

```md
:::note
这是一个注释
:::

:::tip
这是一个提示
:::

:::info
这是一个信息框
:::

:::caution
这是一个警告
:::

:::danger
这是一个危险提示
:::
```

### 添加和使用图片

1. 将图片文件放在 `web/static/img/` 目录下
2. 在 Markdown 中引用图片：`![描述](/img/your-image.png)`

### 自定义组件

本项目包含一些自定义组件，可以在 Markdown 中使用：

#### 滚动进度指示器

页面顶部有一个滚动进度指示器，显示当前阅读位置。这是通过 `ScrollProgress` 组件实现的。

## 侧边栏配置

侧边栏配置在 `web/sidebars.js` 文件中管理。修改此文件可以调整文档的导航结构。

示例配置：

```javascript
module.exports = {
  docs: [
    {
      type: 'category',
      label: '入门',
      items: ['intro', 'getting-started'],
    },
    {
      type: 'category',
      label: '核心概念',
      items: ['core/concept-one', 'core/concept-two'],
    },
  ],
};
```

## 主题定制

### CSS 自定义

您可以通过编辑以下文件来自定义网站样式：

- `web/src/css/custom.css`: 主要自定义样式
- `web/src/css/code-blocks.css`: 代码块样式
- `web/src/css/dark-theme.css`: 暗色主题样式

### 布局自定义

网站的布局组件位于 `web/src/theme/` 目录中。如果需要深度自定义布局，可以修改这些文件。

## MDX 支持

Docusaurus 支持 MDX，允许在 Markdown 中使用 React 组件：

```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="apple"
  values={[
    {label: '苹果', value: 'apple'},
    {label: '橙子', value: 'orange'},
    {label: '香蕉', value: 'banana'},
  ]}>
  <TabItem value="apple">苹果是红色或绿色的。</TabItem>
  <TabItem value="orange">橙子是橙色的。</TabItem>
  <TabItem value="banana">香蕉是黄色的。</TabItem>
</Tabs>
```

## 搜索功能

网站集成了搜索功能，会自动索引所有文档内容。您无需为此进行额外配置。

## 版本控制

如果需要为文档添加版本控制，可以使用 Docusaurus 的版本控制功能：

```bash
npm run docusaurus docs:version 1.0.0
```

这会创建文档的 1.0.0 版本快照。

## 部署

完成编辑后，构建静态网站文件并部署到您的托管服务：

```bash
cd web
npm run build
```

然后将 `web/build` 目录中的文件部署到您的托管服务。

## 常见问题解答

### 修改了文件但网站未更新

在开发模式下，大多数更改会自动触发热重载。如果没有，请尝试：

1. 检查控制台是否有错误
2. 重启开发服务器
3. 清除浏览器缓存

### 自定义 404 页面

如需自定义 404 页面，请创建 `web/src/pages/404.js` 文件。

## 获取帮助

如有更多问题，请参考：

- [Docusaurus 官方文档](https://docusaurus.io/docs)
- 查看项目源码或联系项目维护者 