---
title: CSS 毛玻璃效果实现详解
date: 2026-05-25
tags:
  - CSS
  - 前端
  - 设计
description: 详解 backdrop-filter 和 rgba 实现毛玻璃效果的多种方案，附完整代码示例。
---

# CSS 毛玻璃效果实现详解

## 什么是毛玻璃效果

毛玻璃（Glassmorphism）是一种流行的 UI 设计风格，通过背景模糊和半透明来营造层次感。

## 核心属性：backdrop-filter

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

## 暗色模式适配

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

html[data-theme="dark"] {
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

## 兼容性说明

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 76+ |
| Firefox | 103+ |
| Safari | 9+ (需 -webkit- 前缀) |
| Edge | 79+ |

> 移动端 iOS Safari 9.0+ 就支持，Android 端 Chrome 76+ 支持。