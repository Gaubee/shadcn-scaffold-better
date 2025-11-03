import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import type { NavigationProvider } from "./types";

/**
 * BrowserHistoryProvider - 将 Scaffold 导航状态与浏览器 History API 同步
 *
 * 核心功能：
 * 1. 将导航状态序列化到 URL 查询参数
 * 2. 监听浏览器前进/后退事件
 * 3. 支持直接访问 URL 恢复状态
 * 4. 支持页面刷新保持状态
 *
 * URL 格式：
 * /path?pane=activePane&data=encodeURIComponent(JSON.stringify(panes))
 *
 * 适用场景：
 * - 标准的 Web 应用
 * - 需要 SEO 友好的 URL
 * - 需要支持浏览器前进/后退
 */
export class BrowserHistoryProvider<T extends PaneParams> implements NavigationProvider<T> {
  private baseUrl: string;
  private onStateChange: (state: NavigationState<T>) => void;

  constructor(baseUrl: string, onStateChange: (state: NavigationState<T>) => void) {
    this.baseUrl = baseUrl;
    this.onStateChange = onStateChange;

    // 监听浏览器前进/后退
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", this.handlePopState);
    }
  }

  /**
   * 从 URL 恢复导航状态
   */
  private parseUrlToState(url: string): NavigationState<T> | null {
    try {
      const urlObj = new URL(url, window.location.origin);
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

  /**
   * 处理浏览器前进/后退
   */
  private handlePopState = (event: PopStateEvent) => {
    if (event.state?.navigationState) {
      this.onStateChange(event.state.navigationState);
    } else {
      // 如果没有存储的状态，尝试从 URL 解析
      const state = this.parseUrlToState(window.location.href);
      if (state) {
        this.onStateChange(state);
      }
    }
  };

  pushState(state: NavigationState<T>) {
    const url = this.stateToUrl(state);
    window.history.pushState({ navigationState: state }, "", url);
    // 注意：pushState不触发回调，因为外部调用者已经更新了自己的状态
    // 这个方法只负责将状态同步到URL
  }

  replaceState(state: NavigationState<T>) {
    const url = this.stateToUrl(state);
    window.history.replaceState({ navigationState: state }, "", url);
    // 注意：replaceState不触发回调，因为外部调用者已经更新了自己的状态
    // 这个方法只负责将状态同步到URL
  }

  getCurrentState(): NavigationState<T> | null {
    return this.parseUrlToState(window.location.href);
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("popstate", this.handlePopState);
    }
  }
}
