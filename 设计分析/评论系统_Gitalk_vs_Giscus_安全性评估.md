# 评论系统安全性评估：Gitalk → giscus 迁移方案

> 日期：2026-06-12
> 触发原因：Gitalk 要求在前端代码中暴露 `clientSecret`，存在严重安全隐患

---

## 1. 问题分析

### Gitalk 的安全缺陷

Gitalk 需要在前端代码中直接写入以下敏感信息：

```ts
// Comments.vue — 任何人查看页面源代码即可读取！
const GITALK_CONFIG = {
  clientID: 'xxx',        // ⚠️ 可公开
  clientSecret: 'xxx',    // 🔴 高度敏感！等同于密码
  repo: 'xxx',
  owner: 'xxx',
  admin: ['xxx'],
}
```

| 风险 | 严重程度 | 说明 |
|------|----------|------|
| `clientSecret` 泄露 | 🔴 严重 | 任何人打开浏览器 DevTools → Sources 即可查看。攻击者可用此密钥冒充你的 GitHub OAuth App，发起恶意操作 |
| GitHub API 滥用 | 🔴 严重 | 泄露的密钥可被用于调用 GitHub API，消耗你的请求配额（5000次/小时认证后） |
| 无法撤销 | 🟡 中等 | GitHub OAuth App 的 clientSecret 泄露后只能重新生成，但新密钥仍需放在前端代码中，同样会泄露 |
| OAuth App 权限 | 🔴 严重 | 创建的 OAuth App 可能关联到用户的其他仓库，泄露影响面扩大 |

**结论：Gitalk 的 clientSecret 写入前端是不安全的架构设计。静态站点无法保护此密钥。**

---

## 2. giscus 替代方案

### 2.1 giscus 是什么

[giscus](https://giscus.app/) 是基于 GitHub Discussions API 的评论系统，由 GitHub 官方赞助。

### 2.2 认证模型对比

| 特性 | Gitalk | giscus |
|------|--------|--------|
| **前端需要密钥** | 🔴 clientID + clientSecret | ✅ 仅 repo 名称 + repo ID（公开信息） |
| **认证方式** | OAuth App（前端携带 secret） | GitHub App（服务端代理，前端无密钥） |
| **评论存储** | GitHub Issues | GitHub Discussions |
| **安全模型** | 不安全（密钥裸奔） | 安全（giscus 服务端代理认证） |
| **GitHub 账号要求** | ✅ 需要 | ✅ 需要 |
| **是否开源** | ✅ MIT | ✅ MIT |
| **CDN 资源** | unpkg.com | giscus.app 自托管 |
| **暗色主题** | 需要手写 CSS 覆盖 | ✅ 内置 `data-theme` 属性切换 |
| **i18n 中文** | ✅ 支持 | ✅ 支持 |
| **项目活跃度** | 不活跃（最后更新 2022） | 活跃（持续维护） |

### 2.3 giscus 工作流程

```
用户访问博客文章
       ↓
前端加载 giscus.js（仅包含 repo/repo-id 等公开参数）
       ↓
giscus 服务端代理 GitHub OAuth 认证
       ↓
用户授权后，评论写入仓库的 Discussions
       ↓
前端的 giscus 组件读取 Discussions 渲染评论列表
```

**关键区别**：giscus 的 OAuth 流程完全在其服务端完成，前端代码中 **不包含任何密钥**。

### 2.4 用户需要配置什么

| 配置项 | 是否敏感 | 获取方式 |
|--------|----------|----------|
| `repo` | ❌ 公开 | 仓库名 `owner/name` |
| `repo-id` | ❌ 公开 | GitHub API: `gh api graphql -f query='{repository(owner:"X",name:"Y"){id}}'` |
| `category` | ❌ 公开 | Discussions 分类名 |
| `category-id` | ❌ 公开 | GitHub API 同上 |
| `mapping` | ❌ 公开 | 通常用 `pathname` |

**全部参数都是公开的、无敏感信息！**

---

## 3. 可行性评估

| 维度 | 评分 | 说明 |
|------|------|------|
| **安全性** | ✅✅✅ | 前端零密钥，比 Gitalk 安全得多 |
| **配置复杂度** | ⚠️ | 比 Gitalk 多一步：在仓库 Settings 中启用 Discussions 功能 |
| **迁移成本** | ✅ 低 | 替换 Comments.vue 组件即可，Layout.vue 无需改动 |
| **环境依赖** | ✅ 零 | 纯 CDN 加载，无需任何后端 |
| **暗色主题** | ✅✅ | 内置支持 `data-theme`，无需手写 CSS 覆盖 |
| **中文支持** | ✅ | 内置 zh-CN 语言 |
| **稳定性** | ✅ | GitHub 官方赞助项目，持续维护 |

### ⚠️ 唯一需要注意的点

1. **仓库必须启用 Discussions**：Settings → Features → Enable Discussions
2. **giscus 依赖 GitHub App**：安装 giscus GitHub App 并授权到目标仓库（一次性操作）
3. **评论存储在 Discussions 中**：不同于 Gitalk 存在 Issues 里，但功能类似

---

## 4. 实施计划

### 4.1 用户准备（一次性操作）

1. 访问 https://github.com/apps/giscus 安装 GitHub App，授权到博客仓库
2. 仓库 Settings → Features → Enable Discussions
3. 创建一个 Discussions 分类（如 "Comments"）
4. 访问 https://giscus.app/ 填入仓库信息，自动生成配置代码

### 4.2 代码改动量

| 文件 | 改动 |
|------|------|
| `Comments.vue` | 🔄 完全重写（从 Gitalk 改为 giscus） |
| `Layout.vue` | ✅ 无需改动（接口不变） |
| `theme/index.ts` | ✅ 无需改动（组件名不变） |

### 4.3 giscus 配置示例

```html
<script src="https://giscus.app/client.js"
  data-repo="owner/repo"
  data-repo-id="R_kgDOXXX"
  data-category="Comments"
  data-category-id="DIC_kwDOXXX"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  data-loading="lazy"
  crossorigin="anonymous"
  async>
</script>
```

**注意**：以上全部参数都是公开信息，无 `secret`、无 `token`。

---

## 5. 对比总结

| 评估项 | Gitalk | giscus | 结论 |
|--------|--------|--------|------|
| 安全性 | 🔴 密钥泄露 | ✅ 零密钥 | **giscus 完胜** |
| 配置复杂度 | 🟡 中等 | 🟡 中等 | 相当 |
| 维护状态 | 🔴 停更 | ✅ 活跃 | **giscus 完胜** |
| 主题适配 | 🟡 手动 | ✅ 内置 | **giscus 完胜** |
| 存储位置 | Issues | Discussions | 差别不大 |

### 建议

**强烈建议将 Comments.vue 从 Gitalk 切换为 giscus**。改动量极小（仅替换一个组件），安全性提升巨大。

是否同意此方案？同意后我将立即实施替换。