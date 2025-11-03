import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";

// ==================== Base Router Interface ====================
export interface NavigationProvider<T extends PaneParams> {
  /**
   * 获取当前导航状态
   */
  getCurrentState(): NavigationState<T> | null;

  /**
   * 推送新的导航状态（创建新的历史记录）
   */
  pushState(state: NavigationState<T>): void;

  /**
   * 替换当前导航状态（不创建新的历史记录）
   */
  replaceState(state: NavigationState<T>): void;

  /**
   * 清理资源
   */
  destroy(): void;
}

// ==================== Browser History Provider ====================
/**
 * BrowserHistoryProvider - 将 Scaffold 导航状态与浏览器 History API 同步
 *
 * 核心功能：
 * 1. 将导航状态序列化到 URL
 * 2. 监听浏览器前进/后退
 * 3. 支持直接访问 URL
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

  // 从 URL 恢复导航状态
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

  // 将导航状态序列化到 URL
  private stateToUrl(state: NavigationState<T>): string {
    const params = new URLSearchParams();
    params.set("pane", state.route.activePane);
    params.set("data", encodeURIComponent(JSON.stringify(state.route.panes)));
    return `${this.baseUrl}?${params.toString()}`;
  }

  // 处理浏览器前进/后退
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
  }

  replaceState(state: NavigationState<T>) {
    const url = this.stateToUrl(state);
    window.history.replaceState({ navigationState: state }, "", url);
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

// ==================== Hash Router Provider ====================
/**
 * HashRouterProvider - 使用 URL Hash 来存储导航状态
 *
 * 特点：
 * 1. 适用于静态网站托管（如 GitHub Pages）
 * 2. 不需要服务器端支持
 * 3. URL 格式：#/pane?data=...
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

  // 从 Hash 解析导航状态
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

  // 将导航状态序列化到 Hash
  private stateToHash(state: NavigationState<T>): string {
    const params = new URLSearchParams();
    params.set("data", encodeURIComponent(JSON.stringify(state.route.panes)));
    return `#/${state.route.activePane}?${params.toString()}`;
  }

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

// ==================== Memory Router Provider ====================
/**
 * MemoryRouterProvider - 将导航状态保存在内存中
 *
 * 特点：
 * 1. 不会修改 URL
 * 2. 适用于需要独立导航状态的场景
 * 3. 支持完整的历史记录功能
 */
export class MemoryRouterProvider<T extends PaneParams> implements NavigationProvider<T> {
  private history: NavigationState<T>[] = [];
  private currentIndex = -1;
  private onStateChange: (state: NavigationState<T>) => void;

  constructor(initialState: NavigationState<T>, onStateChange: (state: NavigationState<T>) => void) {
    this.onStateChange = onStateChange;
    this.history.push(initialState);
    this.currentIndex = 0;
  }

  pushState(state: NavigationState<T>) {
    // 删除当前位置之后的所有历史记录
    this.history = this.history.slice(0, this.currentIndex + 1);
    // 添加新状态
    this.history.push(state);
    this.currentIndex++;
  }

  replaceState(state: NavigationState<T>) {
    this.history[this.currentIndex] = state;
  }

  getCurrentState(): NavigationState<T> | null {
    return this.history[this.currentIndex] || null;
  }

  /**
   * 返回上一个状态
   */
  goBack(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const state = this.history[this.currentIndex];
      if (state) {
        this.onStateChange(state);
        return true;
      }
    }
    return false;
  }

  /**
   * 前进到下一个状态
   */
  goForward(): boolean {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const state = this.history[this.currentIndex];
      if (state) {
        this.onStateChange(state);
        return true;
      }
    }
    return false;
  }

  /**
   * 是否可以后退
   */
  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * 是否可以前进
   */
  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  destroy() {
    // Memory router 无需清理
  }
}
