import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import type { NavigationProvider } from "./types";

/**
 * MemoryRouterProvider - 将导航状态保存在内存中
 *
 * 核心功能：
 * 1. 状态仅保存在内存中，不修改 URL
 * 2. 支持完整的历史记录功能（前进/后退）
 * 3. 独立的导航状态管理
 * 4. 页面刷新会丢失状态
 *
 * 适用场景：
 * - 嵌入式应用（iframe, webview）
 * - 不需要 URL 同步的应用
 * - 需要完全独立的导航状态管理
 * - 临时性的导航流程（如向导、对话框）
 */
export class MemoryRouterProvider<T extends PaneParams> implements NavigationProvider<T> {
  private history: NavigationState<T>[] = [];
  private currentIndex = -1;
  private onStateChange: (state: NavigationState<T>) => void;

  constructor(initialState: NavigationState<T>, onStateChange: (state: NavigationState<T>) => void) {
    this.onStateChange = onStateChange;
    this.history.push(this.cloneState(initialState));
    this.currentIndex = 0;
    // Bug Fix #1: 构造函数应该触发初始状态回调
    // 但为了避免在构造函数中产生副作用，这里暂不自动触发
    // 外部调用者应该根据需要手动触发或获取初始状态
  }

  /**
   * 深拷贝状态对象，确保数据隔离
   */
  private cloneState(state: NavigationState<T>): NavigationState<T> {
    return JSON.parse(JSON.stringify(state));
  }

  pushState(state: NavigationState<T>) {
    // 删除当前位置之后的所有历史记录
    this.history = this.history.slice(0, this.currentIndex + 1);
    // 添加新状态（深拷贝以保证数据隔离）
    this.history.push(this.cloneState(state));
    this.currentIndex++;
    // Bug Fix #2: pushState应该通知状态变化
    this.onStateChange(this.cloneState(state));
  }

  replaceState(state: NavigationState<T>) {
    const clonedState = this.cloneState(state);
    this.history[this.currentIndex] = clonedState;
    // Bug Fix #3: replaceState应该通知状态变化
    this.onStateChange(this.cloneState(clonedState));
  }

  getCurrentState(): NavigationState<T> | null {
    const state = this.history[this.currentIndex];
    // 返回深拷贝以保护内部状态
    return state ? this.cloneState(state) : null;
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
