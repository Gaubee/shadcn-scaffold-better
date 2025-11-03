import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import type { NavigationProvider } from "./types";

/**
 * NavigationAPIProvider - 使用现代 Navigation API 管理导航状态
 *
 * 核心功能：
 * 1. 使用标准的 Navigation API（比 History API 更强大）
 * 2. 更好的导航事件处理和拦截能力
 * 3. 原生支持导航状态管理
 * 4. 更好的单页应用导航支持
 *
 * 浏览器兼容性：
 * - Chrome/Edge: ✅ 支持（v102+）
 * - Firefox: ✅ 支持（v118+）
 * - Safari: ❌ 不支持（截至 2024）
 *
 * URL 格式：
 * /path?pane=activePane&data=encodeURIComponent(JSON.stringify(panes))
 *
 * 适用场景：
 * - 现代浏览器的 Web 应用
 * - 需要更强大导航控制的单页应用
 * - 需要拦截和处理导航事件的应用
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
 */
export class NavigationAPIProvider<T extends PaneParams> implements NavigationProvider<T> {
  private baseUrl: string;
  private onStateChange: (state: NavigationState<T>) => void;
  private navigation: Navigation | null = null;
  private abortController: AbortController | null = null;

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
            const state = this.parseUrlToState(event.destination.url);
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
   * 从 URL 恢复导航状态
   */
  private parseUrlToState(url: string): NavigationState<T> | null {
    try {
      const urlObj = new URL(url);
      const activePane = urlObj.searchParams.get("pane");
      const panesData = urlObj.searchParams.get("data");

      if (!activePane || !panesData) return null;

      const panes = JSON.parse(decodeURIComponent(panesData));

      return {
        route: {
          index: 0,
          activePane: activePane as any,
          panes,
        },
        history: [
          {
            index: 0,
            activePane: activePane as any,
            panes,
          },
        ],
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

    // 使用 Navigation API 进行导航
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

    // 尝试从当前条目获取状态
    const currentEntry = this.navigation.currentEntry;
    if (currentEntry?.getState) {
      const state = currentEntry.getState() as { navigationState?: NavigationState<T> };
      if (state?.navigationState) {
        return state.navigationState;
      }
    }

    // 如果没有存储的状态，尝试从 URL 解析
    return this.parseUrlToState(window.location.href);
  }

  destroy() {
    // 取消事件监听
    this.abortController?.abort();
    this.abortController = null;
  }
}
