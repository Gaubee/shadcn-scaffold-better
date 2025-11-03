import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";

/**
 * NavigationProvider - 导航提供者的基础接口
 *
 * 所有的导航提供者（BrowserHistory, HashRouter, MemoryRouter, NavigationAPI, Auto）
 * 都必须实现这个接口，以确保与 Scaffold 导航系统的兼容性。
 */
export interface NavigationProvider<T extends PaneParams> {
  /**
   * 获取当前导航状态
   * @returns 当前的导航状态，如果没有状态则返回 null
   */
  getCurrentState(): NavigationState<T> | null;

  /**
   * 推送新的导航状态（创建新的历史记录）
   * @param state - 新的导航状态
   */
  pushState(state: NavigationState<T>): void;

  /**
   * 替换当前导航状态（不创建新的历史记录）
   * @param state - 新的导航状态
   */
  replaceState(state: NavigationState<T>): void;

  /**
   * 检查是否可以后退
   * @returns 如果可以后退则返回 true
   */
  canGoBack?(): boolean;

  /**
   * 检查是否可以前进
   * @returns 如果可以前进则返回 true
   */
  canGoForward?(): boolean;

  /**
   * 后退到上一个状态
   * @returns 如果成功后退则返回 true
   */
  goBack?(): boolean;

  /**
   * 前进到下一个状态
   * @returns 如果成功前进则返回 true
   */
  goForward?(): boolean;

  /**
   * 清理资源（移除事件监听器等）
   */
  destroy(): void;
}
