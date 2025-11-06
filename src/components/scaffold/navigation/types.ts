import type { PaneParams } from "@/components/scaffold/scaffold";

export type PaneName = "rail" | "list" | "detail" | "tail";

export interface NavigationRoute<T extends PaneParams = PaneParams> {
  index: number;
  /** 当前在移动端/堆叠视图中激活的面板 */
  activePane: PaneName;

  /** 每个面板各自的内部状态参数 */
  panes: {
    rail: T["rail"];
    list: T["list"];
    detail: T["detail"];
    tail: T["tail"];
  };
}

export interface NavigationState<T extends PaneParams = PaneParams> {
  route: NavigationRoute<T>;
  history: NavigationRoute<T>[];
}


export interface NavigationHistoryEntry<T extends PaneParams = PaneParams> {
  id: string;
  index: number;
  key: string;
  url: string;
  getState(): T;
}

export interface NavigationCurrentEntryChangeEvent<T extends PaneParams = PaneParams> {
  navigationType: "push" | "replace" | "reload" | "traverse";
  from: NavigationHistoryEntry<T>;
  entry: NavigationHistoryEntry<T>;
}

export interface NavigationProvider<T extends PaneParams = PaneParams> {
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly currentEntry: NavigationHistoryEntry<T> | null;
  readonly entries: NavigationHistoryEntry<T>[];

  navigate(
    url: string,
    options?: {
      state?: T;
      info?: any;
      history?: "auto" | "push" | "replace";
    }
  ): void;

  back(options?: { info?: any }): void;
  forward(options?: { info?: any }): void;
  reload(options?: { info?: any; state?: T }): void;
  traverseTo(key: string, options?: { info?: any }): void;

  on<K extends keyof NavigationProviderEventMap<T>>(
    type: K,
    listener: (ev: NavigationProviderEventMap<T>[K]) => any
  ): void;
  off<K extends keyof NavigationProviderEventMap<T>>(
    type: K,
    listener: (ev: NavigationProviderEventMap<T>[K]) => any
  ): void;

  destroy(): void;
}

export interface NavigationProviderEventMap<T extends PaneParams = PaneParams> {
  "current-entry-change": NavigationCurrentEntryChangeEvent<T>;
  navigate: {
    canTransition: boolean;
    destination: NavigationHistoryEntry<T>;
    info: any;
  };
  dispose: Event;
}