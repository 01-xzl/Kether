# Issue 处理记录：部署配置错误修复

> 日期：2026-06-15
> 来源：外部 issue 反馈
> 状态：✅ 已修复

---

## Issue #1：CI 从未触发

### 现象
每次 push 代码后 GitHub Actions 没有自动构建部署，GitHub Pages 从未更新。

### 根因
`deploy.yml` 第 6 行监听的是 `main` 分支：

```yaml
on:
  push:
    branches:
      - main   # ❌ 错误
```

但仓库的实际默认分支是 `master`（Git 旧版默认名）：

```bash
$ git branch -a
* master
  remotes/origin/master
```

**`main` ≠ `master`**，分支名不匹配导致 GitHub Actions 从未被触发。

### 修复

```yaml
# 修改后
branches:
  - master  # ✅ 匹配实际分支名
```

### 影响范围
- 自项目创建以来所有 push 均未触发 CI
- GitHub Pages 站点从未部署成功

---

## Issue #2：base 路径错误导致页面白屏

### 现象
GitHub Pages 部署后页面白屏，所有静态资源（JS/CSS）返回 404。

### 根因
`config.mts` 第 11 行 `base` 设置为根路径 `/`：

```ts
base: '/',   // ❌ 错误
```

但仓库名为 `Kether`，GitHub Pages 实际部署在子路径：

```
实际 URL: https://01-xzl.github.io/Kether/
预期 URL: https://01-xzl.github.io/
```

VitePress 构建时会将所有资源路径生成为 `/assets/xxx.js`，但浏览器实际应该加载 `/Kether/assets/xxx.js`。

路径不匹配 → 资源全部 404 → 页面白屏。

注释中其实已经写了正确答案但未被应用：
```ts
// 如果部署到子路径（username.github.io/repo/），改为 '/repo/'
```

### 修复

```ts
base: '/Kether/',   // ✅ 匹配仓库名
```

### 影响范围
- 所有静态资源（JS/CSS/字体/图片）加载失败
- 所有内部链接（导航栏、文章链接）跳转错误
- 本地开发 `npm run docs:dev` 不受影响（dev server 自动处理 base）

---

## Issue #3：socialLinks 链接为空

### 现象
导航栏 GitHub 图标链接指向 `https://github.com/`，非用户主页。

### 根因
`config.mts` 第 46 行：

```ts
socialLinks: [
  { icon: 'github', link: 'https://github.com/' }  // ❌ 通用链接
]
```

创建项目时使用了占位链接，后期未更新为实际用户名。

### 修复

```ts
socialLinks: [
  { icon: 'github', link: 'https://github.com/01-xzl' }   // ✅ 用户主页
]
```

### 同时修复
页脚 `copyright` 中的链接也使用了同样的占位 URL，一并修改。

---

## 修复汇总

| Issue | 文件 | 行 | 修改前 | 修改后 |
|-------|------|-----|--------|--------|
| #1 | `.github/workflows/deploy.yml` | 6 | `- main` | `- master` |
| #2 | `docs/.vitepress/config.mts` | 11 | `base: '/'` | `base: '/Kether/'` |
| #3 | `docs/.vitepress/config.mts` | 46 | `link: 'https://github.com/'` | `link: 'https://github.com/01-xzl'` |
| #3 | `docs/.vitepress/config.mts` | 52 | `href="https://github.com/"` | `href="https://github.com/01-xzl"` |

---

## 预防措施

| 措施 | 说明 |
|------|------|
| 项目初始化时确认分支名 | `git branch` 确认后填入 deploy.yml |
| 部署前检查 base 路径 | 确认 repo 名 → 设置 base |
| 避免使用占位链接 | 所有外部链接在首次 push 前确认 |