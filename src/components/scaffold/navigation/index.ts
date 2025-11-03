/**
 * Scaffold Navigation Providers
 *
 * 这个模块提供了多种导航状态管理策略，用于将 Scaffold 的导航状态
 * 与不同的路由机制（Browser History, Hash Router, Memory Router, Navigation API）集成。
 *
 * @module @/components/scaffold/navigation
 */

// ==================== Types ====================
export type { NavigationProvider } from "./types";

// ==================== Providers ====================

/**
 * BrowserHistoryProvider - 使用浏览器 History API
 * - 标准的 URL 查询参数
 * - 支持浏览器前进/后退
 * - 适用于需要 SEO 的应用
 */
export { BrowserHistoryProvider } from "./browser-history-provider";

/**
 * HashRouterProvider - 使用 URL Hash
 * - 适用于静态网站托管
 * - 无需服务器端支持
 * - URL 格式：#/pane?data=...
 */
export { HashRouterProvider } from "./hash-router-provider";

/**
 * MemoryRouterProvider - 内存中的导航状态
 * - 不修改 URL
 * - 适用于嵌入式应用
 * - 刷新会丢失状态
 */
export { MemoryRouterProvider } from "./memory-router-provider";

/**
 * NavigationAPIProvider - 使用现代 Navigation API
 * - 更强大的导航控制
 * - 仅支持现代浏览器（Chrome 102+, Firefox 118+）
 * - Safari 不支持
 */
export { NavigationAPIProvider } from "./navigation-api-provider";

/**
 * AutoProvider - 自动选择最佳 Provider
 * - 优先使用 NavigationAPI
 * - 降级到 BrowserHistory
 * - 推荐用于大多数应用
 */
export { AutoProvider } from "./auto-provider";
