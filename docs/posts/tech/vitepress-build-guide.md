---
title: VitePress 搭建个人博客指南
date: 2026-05-20
tags:
  - VitePress
  - 前端
  - 教程
description: 从零开始使用 VitePress 搭建一个高性能的个人博客，包含自定义主题和自动化部署。
pinned: true
---

# VitePress 搭建个人博客指南

## 为什么选择 VitePress

VitePress 是基于 Vite 和 Vue 3 的静态站点生成器，具有以下优势：

- ⚡ **极快的开发体验**：基于 Vite 的 HMR（热模块替换）
- 📦 **Markdown 原生支持**：直接写 Markdown 即可生成页面
- 🎨 **Vue 驱动**：可以在 Markdown 中使用 Vue 组件
- 🌐 **内置搜索**：1.x 版本内置本地搜索

## 快速开始

```bash
# 安装依赖
npm install -D vitepress vue

# 启动开发服务器
npx vitepress dev docs
```

## 目录结构

```
docs/
├── .vitepress/
│   ├── config.mts        # 站点配置
│   └── theme/            # 自定义主题
├── posts/                # 文章目录
├── public/               # 静态资源
└── index.md              # 首页
```

## 部署

使用 GitHub Actions 可以轻松将站点部署到 GitHub Pages，每次推送代码自动构建部署。

配置好 `deploy.yml` 后，只需将代码推送到 `main` 分支即可自动触发。