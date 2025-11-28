# 日常工具集 🛠️

一个基于React构建的现代化日常工具集Web应用，提供天气预报和日历查询功能。

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ 功能特性

### 🌦️ 天气工具

- **当前天气**：实时温度、天气状况、湿度、风力、降雨概率
- **48小时预报**：逐小时温度曲线图和降雨概率曲线，支持横向滚动
- **15天预报**：未来两周天气趋势，包含最高/最低温度、风力、降雨概率
- **城市切换**：支持手动输入城市名称查询天气

### 📅 日历工具

- **月视图日历**：清晰的月份日历展示
- **农历信息**：显示农历日期、节日、二十四节气
- **节假日标注**：2024-2025年中国法定节假日高亮显示
- **调休标识**：标注调休上班日期
- **月份切换**：便捷的上月/下月/今天导航

## 🚀 快速开始

### 环境要求

- Node.js 16.0+
- npm 7.0+ 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 📦 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.3.1 | UI框架 |
| Vite | 6.0.1 | 构建工具 |
| lunar-javascript | 1.7.2 | 农历转换库 |
| ESLint | 9.15.0 | 代码规范 |

详细技术栈说明请查看：[技术栈文档](./doc/技术栈说明.md)

## 📂 项目结构

```
daily_tools/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Sidebar/        # 侧边栏导航
│   │   ├── Weather/        # 天气工具
│   │   └── Calendar/       # 日历工具
│   ├── utils/              # 工具函数
│   │   ├── mockData.js     # Mock天气数据
│   │   └── calendarUtils.js # 日历工具函数
│   ├── App.jsx             # 根组件
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── doc/                    # 文档目录
├── public/                 # 静态资源
├── MILESTONES.md           # 开发里程碑
├── package.json
└── vite.config.js
```

## 🎨 界面预览

### 主界面布局
- 左侧：竖向工具切换Tab
- 右侧：工具内容展示区
- 支持响应式设计，移动端自适应

### 天气工具
- 渐变背景，卡片式设计
- SVG绘制的温度和降雨曲线
- 现代化的交互体验

### 日历工具
- 网格布局，清晰易读
- 颜色区分节假日和调休
- 农历信息小字显示

## 📖 开发文档

- [开发里程碑](./MILESTONES.md) - 项目开发进度和规划
- [技术栈说明](./doc/技术栈说明.md) - 详细的技术选型和架构说明

## 🔧 开发规范

### 代码风格

- 组件：使用函数式组件 + Hooks
- 命名：驼峰命名法（组件大驼峰，变量小驼峰）
- 注释：关键逻辑添加英文注释
- 格式：通过ESLint检查

### Git提交规范

遵循 Conventional Commits 规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链相关
```

## 📝 待办事项

- [ ] 接入真实天气API
- [ ] 实现位置自动获取功能
- [ ] 添加城市搜索建议
- [ ] 用户偏好设置持久化
- [ ] 主题切换（明暗模式）
- [ ] 添加更多工具（番茄钟、备忘录等）

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 👥 作者

开发团队

## 🙏 致谢

- [React](https://reactjs.org/) - 优秀的UI框架
- [Vite](https://vitejs.dev/) - 极速的构建工具
- [lunar-javascript](https://github.com/6tail/lunar-javascript) - 强大的农历库
- 所有开源社区的贡献者

---

**开发状态**: 🚧 活跃开发中  
**最后更新**: 2024-11-28

如有问题或建议，欢迎提Issue！⭐

