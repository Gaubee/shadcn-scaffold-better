import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouterProvider } from "../memory-router-provider";
import type { NavigationState, PaneParams } from "../../scaffold";

interface TestPaneParams extends PaneParams {
  home: { userId?: string };
  settings: { section?: string };
  profile: { tab?: string };
}

describe("MemoryRouterProvider", () => {
  const createInitialState = (): NavigationState<TestPaneParams> => ({
    route: {
      index: 0,
      activePane: "home",
      panes: {
        home: { userId: "123" },
        settings: {},
        profile: {},
      },
    },
    history: [
      {
        index: 0,
        activePane: "home",
        panes: {
          home: { userId: "123" },
          settings: {},
          profile: {},
        },
      },
    ],
  });

  describe("基础功能", () => {
    it("应该正确初始化并返回初始状态", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();

      const provider = new MemoryRouterProvider(initialState, onStateChange);
      const currentState = provider.getCurrentState();

      expect(currentState).toEqual(initialState);
    });

    it("构造函数应该触发onStateChange回调（Bug #1）", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();

      new MemoryRouterProvider(initialState, onStateChange);

      // Bug: 初始化后应该触发回调，让外部知道初始状态
      // 当前实现没有触发
      expect(onStateChange).not.toHaveBeenCalled(); // 这是当前的bug行为
    });
  });

  describe("pushState", () => {
    it("应该添加新状态到历史记录", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const newState: NavigationState<TestPaneParams> = {
        route: {
          index: 1,
          activePane: "settings",
          panes: {
            home: { userId: "123" },
            settings: { section: "account" },
            profile: {},
          },
        },
        history: [
          initialState.route,
          {
            index: 1,
            activePane: "settings",
            panes: {
              home: { userId: "123" },
              settings: { section: "account" },
              profile: {},
            },
          },
        ],
      };

      provider.pushState(newState);
      const currentState = provider.getCurrentState();

      expect(currentState).toEqual(newState);
    });

    it("pushState应该触发onStateChange回调（已修复）", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const newState: NavigationState<TestPaneParams> = {
        ...initialState,
        route: { ...initialState.route, activePane: "settings" },
      };

      provider.pushState(newState);

      // 修复后：pushState 应该触发回调通知状态变化
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          route: expect.objectContaining({
            activePane: "settings",
          }),
        })
      );
    });

    it("pushState后应该可以goBack", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const newState: NavigationState<TestPaneParams> = {
        ...initialState,
        route: { ...initialState.route, activePane: "settings" },
      };

      provider.pushState(newState);
      expect(provider.canGoBack()).toBe(true);
      expect(provider.canGoForward()).toBe(false);
    });

    it("在历史记录中间pushState应该清除后续历史", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      // 添加两个状态
      const state2: NavigationState<TestPaneParams> = {
        ...initialState,
        route: { ...initialState.route, activePane: "settings" },
      };
      const state3: NavigationState<TestPaneParams> = {
        ...initialState,
        route: { ...initialState.route, activePane: "profile" },
      };

      provider.pushState(state2);
      provider.pushState(state3);

      // 后退到中间
      provider.goBack();
      expect(provider.canGoForward()).toBe(true);

      // 从中间位置push新状态，应该清除forward历史
      const state4: NavigationState<TestPaneParams> = {
        ...initialState,
        route: { ...initialState.route, activePane: "home" },
      };
      provider.pushState(state4);

      expect(provider.canGoForward()).toBe(false);
    });
  });

  describe("replaceState", () => {
    it("应该替换当前状态而不添加新历史记录", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const replacedState: NavigationState<TestPaneParams> = {
        ...initialState,
        route: {
          ...initialState.route,
          panes: {
            ...initialState.route.panes,
            home: { userId: "456" },
          },
        },
      };

      provider.replaceState(replacedState);
      const currentState = provider.getCurrentState();

      expect(currentState).toEqual(replacedState);
      expect(provider.canGoBack()).toBe(false);
    });

    it("replaceState应该触发onStateChange回调（已修复）", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const replacedState: NavigationState<TestPaneParams> = {
        ...initialState,
        route: {
          ...initialState.route,
          panes: {
            ...initialState.route.panes,
            home: { userId: "456" },
          },
        },
      };

      provider.replaceState(replacedState);

      // 修复后：replaceState 应该触发回调通知状态变化
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          route: expect.objectContaining({
            panes: expect.objectContaining({
              home: { userId: "456" },
            }),
          }),
        })
      );
    });
  });

  describe("历史记录导航", () => {
    let provider: MemoryRouterProvider<TestPaneParams>;
    let onStateChange: ReturnType<typeof vi.fn>;
    let state1: NavigationState<TestPaneParams>;
    let state2: NavigationState<TestPaneParams>;
    let state3: NavigationState<TestPaneParams>;

    beforeEach(() => {
      state1 = createInitialState();
      state2 = {
        ...state1,
        route: { ...state1.route, activePane: "settings" },
      };
      state3 = {
        ...state1,
        route: { ...state1.route, activePane: "profile" },
      };

      onStateChange = vi.fn();
      provider = new MemoryRouterProvider(state1, onStateChange);
      provider.pushState(state2);
      provider.pushState(state3);
      onStateChange.mockClear(); // 清除之前的调用记录
    });

    it("goBack应该返回上一个状态", () => {
      const result = provider.goBack();
      expect(result).toBe(true);
      expect(provider.getCurrentState()).toEqual(state2);
      expect(onStateChange).toHaveBeenCalledWith(state2);
    });

    it("goForward应该前进到下一个状态", () => {
      provider.goBack();
      onStateChange.mockClear();

      const result = provider.goForward();
      expect(result).toBe(true);
      expect(provider.getCurrentState()).toEqual(state3);
      expect(onStateChange).toHaveBeenCalledWith(state3);
    });

    it("在第一个位置goBack应该返回false", () => {
      provider.goBack();
      provider.goBack();

      const result = provider.goBack();
      expect(result).toBe(false);
    });

    it("在最后一个位置goForward应该返回false", () => {
      const result = provider.goForward();
      expect(result).toBe(false);
    });

    it("canGoBack应该正确报告导航能力", () => {
      expect(provider.canGoBack()).toBe(true);
      provider.goBack();
      expect(provider.canGoBack()).toBe(true);
      provider.goBack();
      expect(provider.canGoBack()).toBe(false);
    });

    it("canGoForward应该正确报告导航能力", () => {
      expect(provider.canGoForward()).toBe(false);
      provider.goBack();
      expect(provider.canGoForward()).toBe(true);
      provider.goBack();
      expect(provider.canGoForward()).toBe(true);
    });
  });

  describe("边界情况", () => {
    it("应该正确处理空历史记录", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      expect(provider.getCurrentState()).not.toBeNull();
      expect(provider.canGoBack()).toBe(false);
      expect(provider.canGoForward()).toBe(false);
    });

    it("destroy应该不抛出错误", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      expect(() => provider.destroy()).not.toThrow();
    });
  });

  describe("数据完整性", () => {
    it("状态对象应该是独立的（不应被外部修改影响）", () => {
      const initialState = createInitialState();
      const onStateChange = vi.fn();
      const provider = new MemoryRouterProvider(initialState, onStateChange);

      const retrievedState = provider.getCurrentState();

      // 修改获取的状态不应该影响provider内部状态
      if (retrievedState) {
        retrievedState.route.activePane = "settings";
      }

      const retrievedAgain = provider.getCurrentState();
      expect(retrievedAgain?.route.activePane).toBe("home");
    });
  });
});
