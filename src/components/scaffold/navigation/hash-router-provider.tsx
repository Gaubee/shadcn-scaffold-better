import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import type { NavigationProvider } from "./types";

/**
 * HashRouterProvider - 使用 URL Hash 来存储导航状态
 *
 * 核心功能：
 * 1. 将导航状态序列化到 URL Hash
 * 2. 监听 hashchange 事件
 * 3. 支持直接访问 URL 恢复状态
 * 4. 无需服务器端路由配置
 *
 * URL 格式：
 * /path#/activePane?data=encodeURIComponent(JSON.stringify(panes))
 *
 * 适用场景：
 * - 静态网站托管（如 GitHub Pages）
 * - 不需要服务器端支持的单页应用
 * - 需要兼容旧浏览器的应用
 */
export class HashRouterProvider<T extends PaneParams> implements NavigationProvider<T> {
  private onStateChange: (state: NavigationState<T>) => void;

  constructor(onStateChange: (state: NavigationState<T>) => void) {
    this.onStateChange = onStateChange;

    // 监听 hash 变化
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", this.handleHashChange);
    }
  }

  /**
   * 从 Hash 解析导航状态
   */
  private parseHashToState(): NavigationState<T> | null {
    try {
      const hash = window.location.hash.slice(1); // 移除 #
      if (!hash) return null;

      const url = new URL(hash.startsWith("/") ? hash : `/${hash}`, window.location.origin);
      const activePane = url.pathname.slice(1) || url.searchParams.get("pane");
      const panesData = url.searchParams.get("data");

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
   * 将导航状态序列化到 Hash
   */
  private stateToHash(state: NavigationState<T>): string {
    const params = new URLSearchParams();
    params.set("data", encodeURIComponent(JSON.stringify(state.route.panes)));
    return `#/${state.route.activePane}?${params.toString()}`;
  }

  /**
   * 处理 hash 变化
   */
  private handleHashChange = () => {
    const state = this.parseHashToState();
    if (state) {
      this.onStateChange(state);
    }
  };

  pushState(state: NavigationState<T>) {
    window.location.hash = this.stateToHash(state);
  }

  replaceState(state: NavigationState<T>) {
    const hash = this.stateToHash(state);
    window.history.replaceState(null, "", hash);
    // 手动触发状态变化
    const newState = this.parseHashToState();
    if (newState) {
      this.onStateChange(newState);
    }
  }

  getCurrentState(): NavigationState<T> | null {
    return this.parseHashToState();
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("hashchange", this.handleHashChange);
    }
  }
}
