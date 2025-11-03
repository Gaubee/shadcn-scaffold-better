import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import type { NavigationProvider } from "./types";

/**
 * NavigationAPIProvider - 使用现代 Navigation API 管理导航状态
 *
 * 核心功能：
 * 1. 充分利用 Navigation API 的透明性和强大能力
 * 2. 原生支持 canGoBack/canGoForward
 * 3. 通过 entries() 访问完整的历史记录
 * 4. 使用 state 存储完整的 NavigationState
 * 5. 支持 back/forward/traverseTo 等导航操作
 *
 * 浏览器兼容性：
 * - Chrome/Edge: ✅ 支持（v102+）
 * - Firefox: ✅ 支持（v118+）
 * - Safari: ❌ 不支持（截至 2024）
 *
 * 设计理念：
 * - Navigation API 足够透明，我们可以完全依赖它来管理状态
 * - 不需要在 React 中维护独立的 history 数组
 * - Provider 负责状态管理，外部只需要响应状态变化
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
 */
export class NavigationAPIProvider<T extends PaneParams> implements NavigationProvider<T> {
  private baseUrl: string;
  private onStateChange: (state: NavigationState<T>) => void;
  private navigation: Navigation | null = null;
  private abortController: AbortController | null = null;
  // 用于标记是否是我们自己触发的导航
  private isInternalNavigation = false;

  constructor(baseUrl: string, onStateChange: (state: NavigationState<T>) => void) {
    this.baseUrl = baseUrl;
    this.onStateChange = onStateChange;

    // 检查浏览器是否支持 Navigation API
    if (typeof window !== "undefined" && "navigation" in window) {
      this.navigation = window.navigation;
      this.setupNavigationListener();
    } else {
      console.warn("Navigation API is not supported in this browser");
    }
  }

  /**
   * 检查 Navigation API 是否可用
   */
  static isSupported(): boolean {
    return typeof window !== "undefined" && "navigation" in window;
  }

  /**
   * 设置导航监听器
   */
  private setupNavigationListener() {
    if (!this.navigation) return;

    this.abortController = new AbortController();

    // 监听导航事件
    this.navigation.addEventListener(
      "navigate",
      (event) => {
        // 只处理同源导航
        if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) {
          return;
        }

        // 拦截导航以自定义处理
        event.intercept({
          handler: async () => {
            // 如果是我们自己触发的导航，不要触发回调
            // 因为外部调用者已经更新了状态
            if (this.isInternalNavigation) {
              this.isInternalNavigation = false;
              return;
            }

            // 处理外部导航（浏览器前进/后退、用户点击链接等）
            const state = this.buildStateFromNavigationAPI();
            if (state) {
              this.onStateChange(state);
            }
          },
        });
      },
      { signal: this.abortController.signal },
    );
  }

  /**
   * 从 Navigation API 构建完整的 NavigationState
   * 利用 Navigation API 的透明性，我们可以访问所有历史条目
   */
  private buildStateFromNavigationAPI(): NavigationState<T> | null {
    if (!this.navigation || !this.navigation.currentEntry) {
      return null;
    }

    try {
      const currentEntry = this.navigation.currentEntry;
      const entries = this.navigation.entries();

      // 从当前 entry 的 state 获取当前路由信息
      const currentState = currentEntry.getState() as { navigationState?: NavigationState<T> };
      const currentRoute = currentState?.navigationState?.route;

      if (!currentRoute) {
        // 如果没有存储的状态，尝试从 URL 解析
        return this.parseUrlToState(currentEntry.url || window.location.href);
      }

      // 构建完整的历史记录
      // 注意：我们使用 Navigation API 的 entries，而不是自己维护
      const history = entries
        .map((entry) => {
          const entryState = entry.getState() as { navigationState?: NavigationState<T> };
          return entryState?.navigationState?.route;
        })
        .filter((route): route is NonNullable<typeof route> => route !== null && route !== undefined);

      return {
        route: currentRoute,
        history: history.length > 0 ? history : [currentRoute],
      };
    } catch (error) {
      console.error("Failed to build state from Navigation API:", error);
      return null;
    }
  }

  /**
   * 从 URL 解析状态（fallback）
   */
  private parseUrlToState(url: string): NavigationState<T> | null {
    try {
      const urlObj = new URL(url);
      const activePane = urlObj.searchParams.get("pane");
      const panesData = urlObj.searchParams.get("data");

      if (!activePane || !panesData) return null;

      const panes = JSON.parse(decodeURIComponent(panesData));

      const route = {
        index: this.navigation?.currentEntry?.index || 0,
        activePane: activePane as any,
        panes,
      };

      return {
        route,
        history: [route],
      };
    } catch {
      return null;
    }
  }

  /**
   * 将导航状态序列化到 URL
   */
  private stateToUrl(state: NavigationState<T>): string {
    const params = new URLSearchParams();
    params.set("pane", state.route.activePane);
    params.set("data", encodeURIComponent(JSON.stringify(state.route.panes)));
    return `${this.baseUrl}?${params.toString()}`;
  }

  pushState(state: NavigationState<T>) {
    if (!this.navigation) {
      console.warn("Navigation API is not supported, using fallback");
      return;
    }

    const url = this.stateToUrl(state);

    // 标记为内部导航
    this.isInternalNavigation = true;

    // 使用 Navigation API 进行导航，并存储完整状态
    this.navigation.navigate(url, {
      state: { navigationState: state },
      history: "push",
    });
  }

  replaceState(state: NavigationState<T>) {
    if (!this.navigation) {
      console.warn("Navigation API is not supported, using fallback");
      return;
    }

    const url = this.stateToUrl(state);

    // 标记为内部导航
    this.isInternalNavigation = true;

    // 使用 Navigation API 替换当前条目
    this.navigation.navigate(url, {
      state: { navigationState: state },
      history: "replace",
    });
  }

  getCurrentState(): NavigationState<T> | null {
    if (!this.navigation) {
      return null;
    }

    return this.buildStateFromNavigationAPI();
  }

  /**
   * 检查是否可以后退
   * 直接使用 Navigation API 的能力
   */
  canGoBack(): boolean {
    return this.navigation?.canGoBack ?? false;
  }

  /**
   * 检查是否可以前进
   * 直接使用 Navigation API 的能力
   */
  canGoForward(): boolean {
    return this.navigation?.canGoForward ?? false;
  }

  /**
   * 后退
   */
  goBack(): boolean {
    if (!this.navigation || !this.navigation.canGoBack) {
      return false;
    }

    try {
      this.navigation.back();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 前进
   */
  goForward(): boolean {
    if (!this.navigation || !this.navigation.canGoForward) {
      return false;
    }

    try {
      this.navigation.forward();
      return true;
    } catch {
      return false;
    }
  }

  destroy() {
    // 取消事件监听
    this.abortController?.abort();
    this.abortController = null;
  }
}
