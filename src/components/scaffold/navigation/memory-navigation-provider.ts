
import type {
  NavigationProvider,
  NavigationHistoryEntry,
  NavigationCurrentEntryChangeEvent,
  NavigationProviderEventMap,
} from "./types";
import type { PaneParams } from "@/components/scaffold/scaffold";

type MemoryNavigationHistoryEntry<T extends PaneParams = PaneParams> =
  NavigationHistoryEntry<T>;

export class MemoryNavigationProvider<T extends PaneParams = PaneParams>
  implements NavigationProvider<T>
{
  private _entries: MemoryNavigationHistoryEntry<T>[] = [];
  private _current = -1;
  private _listeners: {
    [K in keyof NavigationProviderEventMap<T>]?: Set<
      (ev: NavigationProviderEventMap<T>[K]) => any
    >;
  } = {};

  constructor(initialUrl: string = "/", initialState: T = {} as T) {
    this._entries.push(this.createEntry(initialUrl, initialState));
    this._current = 0;
  }

  private createEntry(
    url: string,
    state: T
  ): MemoryNavigationHistoryEntry<T> {
    const key = Math.random().toString(36).slice(2, 10);
    return {
      id: key,
      key,
      url,
      index: this._entries.length,
      getState: () => state,
    };
  }

  get canGoBack(): boolean {
    return this._current > 0;
  }

  get canGoForward(): boolean {
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

    if (history === "replace") {
      this._entries[this._current] = this.createEntry(url, state);
    } else {
      this._entries.splice(this._current + 1);
      this._entries.push(this.createEntry(url, state));
      this._current++;
    }

    const entry = this.currentEntry!;
    this.emit("current-entry-change", {
      navigationType: history === "replace" ? "replace" : "push",
      from,
      entry,
    });
  }

  back(): void {
    if (this.canGoBack) {
      const from = this.currentEntry!;
      this._current--;
      const entry = this.currentEntry!;
      this.emit("current-entry-change", {
        navigationType: "traverse",
        from,
        entry,
      });
    }
  }

  forward(): void {
    if (this.canGoForward) {
      const from = this.currentEntry!;
      this._current++;
      const entry = this.currentEntry!;
      this.emit("current-entry-change", {
        navigationType: "traverse",
        from,
        entry,
      });
    }
  }

  reload(options?: { info?: any; state?: T }): void {
    const from = this.currentEntry!;
    if (options?.state) {
      this._entries[this._current] = this.createEntry(
        from.url,
        options.state
      );
    }
    const entry = this.currentEntry!;
    this.emit("current-entry-change", {
      navigationType: "reload",
      from,
      entry,
    });
  }

  traverseTo(key: string): void {
    const index = this._entries.findIndex((e) => e.key === key);
    if (index !== -1 && index !== this._current) {
      const from = this.currentEntry!;
      this._current = index;
      const entry = this.currentEntry!;
      this.emit("current-entry-change", {
        navigationType: "traverse",
        from,
        entry,
      });
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
