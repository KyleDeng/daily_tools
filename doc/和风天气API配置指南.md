# 和风天气 API 配置指南 🌤️

本项目使用和风天气（QWeather）API 获取真实天气数据。

## 📝 注册和获取 API Key

### 1. 注册开发者账号

访问 [和风天气开发者平台](https://dev.qweather.com/)，点击右上角"注册"按钮。

### 2. 创建项目

登录后，进入控制台：
1. 点击"创建项目"
2. 填写项目名称（例如：daily_tools）
3. 选择项目类型：**Web API**
4. 点击"确定"创建

### 3. 创建 API Key

1. 进入刚创建的项目
2. 点击"创建 Key"
3. 选择 Key 类型：**Web API**
4. 填写 Key 名称（例如：daily_tools_web）
5. 点击"创建"
6. 复制生成的 **KEY** 值（类似：`abc123def456...`）

## 🔧 配置到项目

### 1. 打开 `.env.local` 文件

在项目根目录找到 `.env.local` 文件（如果没有，从 `.env.example` 复制一份）

### 2. 填入 API Key

找到这一行：
```env
VITE_QWEATHER_API_KEY=your_qweather_api_key_here
```

替换为你的实际 Key：
```env
VITE_QWEATHER_API_KEY=abc123def456...
```

### 3. 重启开发服务器

```bash
# 停止当前服务（Ctrl+C）
# 重新启动
npm run dev
```

## 📊 免费额度

和风天气免费版提供：
- **每天 1000 次请求**
- **每分钟 50 次请求**

对于个人使用和测试完全足够！

## 🌐 API 功能

本项目使用以下和风天气 API：

| API | 功能 | 说明 |
|-----|------|------|
| 城市搜索 | 城市名→LocationID | 支持中文城市名搜索 |
| 实时天气 | 当前温度、湿度、风力等 | 每小时更新 |
| 15天预报 | 未来15天天气预报 | 每天2次更新 |
| 24小时预报 | 逐小时温度和降雨 | 用于48小时曲线图 |

## ⚠️ 注意事项

1. **不要提交到 Git**：`.env.local` 已在 `.gitignore` 中，不会被提交
2. **API Key 保密**：不要在代码中硬编码 API Key
3. **请求限制**：注意免费版的请求次数限制
4. **降级方案**：如果 API 调用失败，系统会自动使用模拟数据

## 🐛 常见问题

### Q: 显示"无法连接天气服务，使用模拟数据"

**原因**：
- API Key 未配置或配置错误
- 超过免费额度限制
- 网络连接问题

**解决**：
1. 检查 `.env.local` 中的 `VITE_QWEATHER_API_KEY` 是否正确
2. 重启开发服务器
3. 检查浏览器控制台的错误信息

### Q: 搜索城市无结果

**原因**：
- 城市名拼写错误
- 不在和风天气数据库中

**解决**：
- 使用标准城市名（例如：北京、上海、广州）
- 避免使用简写或别名

## 📚 相关文档

- [和风天气官方文档](https://dev.qweather.com/docs/api/)
- [城市搜索 API](https://dev.qweather.com/docs/api/geoapi/)
- [实时天气 API](https://dev.qweather.com/docs/api/weather/weather-now/)
- [天气预报 API](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)

---

**配置完成后，刷新页面即可看到真实天气数据！** ✅

