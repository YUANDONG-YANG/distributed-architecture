# Distributed System Simulator

面向架构演示与教学的 **分布式系统模拟器** 前端：用交互式界面说明事务控制、可观测闭环与流量治理等概念（与仓库内 `content/` 下的架构文案对应）。

## 功能概览

| 模块 | 说明 |
|------|------|
| **Transaction Control** | 分布式事务控制链模拟：本地原子性、Outbox、异步消费、重试 / DLQ / 人工介入等，使用 React Flow 展示泳道与状态推进。 |
| **Observability Loop** | 可观测与排障闭环的叙事页：指标、追踪、日志关联与业务级恢复等设计要点。 |
| **Traffic Protection** | 流量治理与系统保护：入站 → 网关 → 服务层 → 隔离 / 熔断 → DB 等分层指标与模拟结果展示。 |
| **Design Rationale** | 设计理据补充：安全、契约、SLO 与影响沟通等扩展视角。 |

技术栈：**React 18**、**Vite 5**、**React Flow**、**Zustand**、**Framer Motion**。

## 环境要求

- **Node.js** 18+（推荐当前 LTS）
- **npm** 9+（或使用兼容的 pnpm / yarn）

## 安装与启动

```bash
# 进入项目目录
cd architecture_draft

# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run dev
```

浏览器访问终端里提示的本地地址即可。

## 其他常用命令

```bash
# 生产构建
npm run build

# 本地预览构建产物（需先 build）
npm run preview
```

## 目录提示

- `src/app/` — 应用壳与路由式 Tab 切换  
- `src/pages/` — 各功能页  
- `src/components/` — 流程图、控制条、面板等  
- `src/store/` — Zustand 状态  
- `src/engine/` — 与模拟相关的轻量逻辑  
- `content/` — 架构说明 Markdown（与 UI 叙事配套，非构建必需）

---

如需扩展新 Tab 或模拟逻辑，可从 `src/data/tabs.js` 与 `src/layout/ShellLayout.jsx` 入手。
