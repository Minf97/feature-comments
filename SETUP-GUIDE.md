# 🚀 CI/CD 设置完整指南

## 📝 总览

本指南将帮你设置 GitHub 到 Vercel 的自动部署流程。

## 🔄 设置流程

### 1️⃣ 准备 Vercel 账户

如果还没有 Vercel 账户：
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户注册/登录

### 2️⃣ 获取 VERCEL_TOKEN

**🔗 链接：** https://vercel.com/account/tokens

**步骤：**
```
1. 登录 Vercel → 点击头像 → Account Settings
2. 左侧菜单点击 "Tokens" 
3. 点击 "Create Token"
4. Token 名称填写：GitHub-Actions-CI-CD
5. 作用域选择：Full Account
6. 过期时间建议选择：No Expiration  
7. 点击 "Create" 
8. 📋 复制生成的 Token（格式：vercel_xxxxxxxxxx）
```

⚠️ **重要：** Token 只显示一次，务必立即复制保存！

### 3️⃣ 在 Vercel 创建项目

**🔗 链接：** https://vercel.com/new

**步骤：**
```
1. 点击 "New Project"
2. 选择 "Import Git Repository" 
3. 找到你的 feature-comments 仓库
4. 点击 "Import"
5. Framework Preset 会自动检测为 "Next.js"
6. 点击 "Deploy" 开始首次部署
```

### 4️⃣ 获取 VERCEL_ORG_ID

**部署完成后：**
```
1. 在 Vercel Dashboard，点击左上角团队名称旁的设置图标
2. 选择 "General" 
3. 找到 "Organization ID" 
4. 📋 复制 ID（格式：team_xxxxxxxxxx 或 user_xxxxxxxxxx）
```

### 5️⃣ 获取 VERCEL_PROJECT_ID

**在项目页面：**
```
1. 进入你刚创建的项目
2. 点击项目页面的 "Settings" 标签
3. 在 "General" 页面找到 "Project ID"
4. 📋 复制 ID（格式：prj_xxxxxxxxxx）
```

### 6️⃣ 在 GitHub 配置 Secrets

**🔗 链接：** https://github.com/你的用户名/feature-comments/settings/secrets/actions

**步骤：**
```
1. 打开你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 左侧菜单：Secrets and variables → Actions  
4. 点击 "New repository secret"
```

**添加以下 3 个 secrets：**

| Secret 名称 | 值的来源 | 示例格式 |
|------------|---------|----------|
| `VERCEL_TOKEN` | 步骤 2 获取的 Token | `vercel_xxxxxxxxxxxx` |
| `VERCEL_ORG_ID` | 步骤 4 获取的组织 ID | `team_xxxxxxxxxxxx` |
| `VERCEL_PROJECT_ID` | 步骤 5 获取的项目 ID | `prj_xxxxxxxxxxxx` |

## ✅ 验证设置

### 测试自动部署

```bash
# 提交代码触发部署
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

### 检查部署状态

1. **GitHub Actions：** 
   - 仓库页面 → Actions 标签
   - 查看工作流运行状态

2. **Vercel Dashboard：**
   - 查看部署日志和状态
   - 获取生产环境 URL

## 🎯 成功标志

✅ GitHub Actions 显示绿色对勾  
✅ Vercel 显示 "Ready" 状态  
✅ 可以通过 Vercel URL 访问网站  
✅ 每次 push 到 main 分支都会自动部署  

## 🛠️ 故障排除

### 常见错误

**1. `Error: Invalid token`**
- 检查 VERCEL_TOKEN 是否正确复制
- 确认 Token 未过期

**2. `Error: Project not found`** 
- 检查 VERCEL_PROJECT_ID 是否正确
- 确认项目已在 Vercel 中创建

**3. `Error: Forbidden`**
- 检查 VERCEL_ORG_ID 是否正确
- 确认 Token 有足够权限

### 调试技巧

```bash
# 本地验证构建
npm run build

# 检查代码规范
npm run lint

# 类型检查
npm run type-check
```

## 🎉 完成！

现在你的项目有了完整的 CI/CD 流程：
- 🔍 自动代码质量检查
- 🚀 自动部署到生产环境  
- 📊 部署状态可视化
- 🔄 每次 push 都会触发流程 