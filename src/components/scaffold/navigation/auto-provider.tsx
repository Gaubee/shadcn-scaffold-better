import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import { BrowserHistoryProvider } from "./browser-history-provider";
import { NavigationAPIProvider } from "./navigation-api-provider";
import type { NavigationProvider } from "./types";

/**
 * AutoProvider - 自动选择最合适的导航提供者
 *
 * 选择策略：
 * 1. 优先使用 NavigationAPIProvider（现代浏览器）
 * 2. 如果不支持 Navigation API，降级到 BrowserHistoryProvider
 * 3. SSR 环境下默认使用 BrowserHistoryProvider
 *
 * 浏览器支持：
 * - Chrome/Edge 102+: NavigationAPIProvider ✅
 * - Firefox 118+: NavigationAPIProvider ✅
 * - Safari: BrowserHistoryProvider (降级) ✅
 * - 其他现代浏览器: BrowserHistoryProvider ✅
 *
 * 适用场景：
 * - 需要自动适配不同浏览器的应用
 * - 追求最佳用户体验但需要兼容性的应用
 * - 不想手动判断浏览器支持的应用
 */
export class AutoProvider<T extends PaneParams> implements NavigationProvider<T> {
  private actualProvider: NavigationProvider<T>;
  private providerType: "navigation-api" | "browser-history";

  constructor(baseUrl: string, onStateChange: (state: NavigationState<T>) => void) {
    // 检测是否支持 Navigation API
    const supportsNavigationAPI = NavigationAPIProvider.isSupported();

    if (supportsNavigationAPI) {
      // 使用现代 Navigation API
      this.actualProvider = new NavigationAPIProvider<T>(baseUrl, onStateChange);
      this.providerType = "navigation-api";
      console.log("AutoProvider: Using NavigationAPIProvider");
    } else {
      // 降级到 Browser History API
      this.actualProvider = new BrowserHistoryProvider<T>(baseUrl, onStateChange);
      this.providerType = "browser-history";
      console.log("AutoProvider: Falling back to BrowserHistoryProvider");
    }
  }

  /**
   * 获取当前使用的 Provider 类型
   */
  getProviderType(): "navigation-api" | "browser-history" {
    return this.providerType;
  }

  /**
   * 检测当前环境推荐使用的 Provider 类型
   */
  static detectRecommendedProvider(): "navigation-api" | "browser-history" | "ssr" {
    // SSR 环境
    if (typeof window === "undefined") {
      return "ssr";
    }

    // 检测 Navigation API 支持
    if (NavigationAPIProvider.isSupported()) {
      return "navigation-api";
    }

    // 降级到 Browser History
    return "browser-history";
  }

  getCurrentState(): NavigationState<T> | null {
    return this.actualProvider.getCurrentState();
  }

  pushState(state: NavigationState<T>): void {
    this.actualProvider.pushState(state);
  }

  replaceState(state: NavigationState<T>): void {
    this.actualProvider.replaceState(state);
  }

  destroy(): void {
    this.actualProvider.destroy();
  }
}
