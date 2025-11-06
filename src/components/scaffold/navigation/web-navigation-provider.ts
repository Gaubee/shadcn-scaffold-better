
import type {
  NavigationProvider,
  NavigationHistoryEntry,
  NavigationProviderEventMap,
} from "./types";
import type { PaneParams } from "@/components/scaffold/scaffold";

interface HistoryState<T extends PaneParams = PaneParams> {
  key: string;
  state: T;
}

export class WebNavigationProvider<T extends PaneParams = PaneParams>
  implements NavigationProvider<T>
{
  private _entries: NavigationHistoryEntry<T>[] = [];
  private _current = -1;
  private _listeners: {
    [K in keyof NavigationProviderEventMap<T>]?: Set<
      (ev: NavigationProviderEventMap<T>[K]) => any
    >;
  } = {};

  constructor() {
    window.addEventListener("popstate", this.handlePopstate);
    const state = window.history.state as HistoryState<T> | null;
    this._entries.push(this.createEntry(window.location.href, state?.state ?? ({} as T), state?.key));
    this._current = this._entries.length - 1;
  }

  private createEntry(
    url: string,
    state: T,
    key?: string
  ): NavigationHistoryEntry<T> {
    const newKey = key ?? Math.random().toString(36).slice(2, 10);
    return {
      id: newKey,
      key: newKey,
      url,
      index: this._entries.length,
      getState: () => state,
    };
  }

  private handlePopstate = (event: PopStateEvent) => {
    const state = event.state as HistoryState<T> | null;
    const from = this.currentEntry!;
    const index = this._entries.findIndex((e) => e.key === state?.key);

    if (index !== -1) {
      this._current = index;
    } else {
      // This could happen if the user navigates to a page outside of the app's control
      const entry = this.createEntry(window.location.href, state?.state ?? ({} as T), state?.key);
      this._entries.push(entry);
      this._current = this._entries.length - 1;
    }
    const entry = this.currentEntry!;

    this.emit("current-entry-change", {
      navigationType: "traverse",
      from,
      entry,
    });
  };

  get canGoBack(): boolean {
    return this._current > 0;
  }

  get canGoForward(): boolean {
    // In a browser environment, we can't know for sure if we can go forward.
    // We can only be certain after a back navigation.
    return this._current < this._entries.length - 1;
  }

  get currentEntry(): NavigationHistoryEntry<T> | null {
    return this._entries[this._current] ?? null;
  }

  get entries(): NavigationHistoryEntry<T>[] {
    return [...this._entries];
  }

  navigate(
    url: string,
    options?: {
      state?: T;
      info?: any;
      history?: "auto" | "push" | "replace";
    }
  ): void {
    const { state = {} as T, history = "auto" } = options ?? {};
    const from = this.currentEntry!;
    const entry = this.createEntry(url, state);

    if (history === "replace") {
      this._entries[this._current] = entry;
      window.history.replaceState({ key: entry.key, state }, "", url);
    } else {
      this._entries.splice(this._current + 1);
      this._entries.push(entry);
      this._current++;
      window.history.pushState({ key: entry.key, state }, "", url);
    }

    this.emit("current-entry-change", {
      navigationType: history === "replace" ? "replace" : "push",
      from,
      entry,
    });
  }

  back(): void {
    window.history.back();
  }

  forward(): void {
    window.history.forward();
  }

  reload(options?: { info?: any; state?: T }): void {
    const from = this.currentEntry!;
    if (options?.state) {
        const entry = this.createEntry(from.url, options.state, from.key);
        this._entries[this._current] = entry;
        window.history.replaceState({ key: entry.key, state: options.state }, "", from.url);
    }
    window.location.reload();
  }

  traverseTo(key: string): void {
    const index = this._entries.findIndex((e) => e.key === key);
    if (index !== -1 && index !== this._current) {
      const delta = index - this._current;
      window.history.go(delta);
    }
  }

  on<K extends keyof NavigationProviderEventMap<T>>(
    type: K,
    listener: (ev: NavigationProviderEventMap<T>[K]) => any
  ): void {
    if (!this._listeners[type]) {
      this._listeners[type] = new Set();
    }
    this._listeners[type]!.add(listener);
  }

  off<K extends keyof NavigationProviderEventMap<T>>(
    type: K,
    listener: (ev: NavigationProviderEventMap<T>[K]) => any
  ): void {
    this._listeners[type]?.delete(listener);
  }

  destroy(): void {
    window.removeEventListener("popstate", this.handlePopstate);
    this._entries = [];
    this._current = -1;
    this._listeners = {};
  }

  private emit<K extends keyof NavigationProviderEventMap<T>>(
    type: K,
    ev: NavigationProviderEventMap<T>[K]
  ): void {
    this._listeners[type]?.forEach((listener) => listener(ev));
  }
}
