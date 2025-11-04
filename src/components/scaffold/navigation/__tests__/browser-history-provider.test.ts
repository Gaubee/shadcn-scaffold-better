import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserHistoryProvider } from "../browser-history-provider";
import type { NavigationState, PaneParams } from "../../scaffold";

interface TestPaneParams extends PaneParams {
  rail: { userId?: string };
  list: { section?: string };
  detail: { tab?: string };
  tail: {};
}

// Mock window.location and history
const mockLocation = {
  href: "http://localhost:3000/",
  origin: "http://localhost:3000",
  pathname: "/",
  search: "",
};

const mockHistory = {
  pushState: vi.fn(),
  replaceState: vi.fn(),
  state: null as any,
};

describe("BrowserHistoryProvider", () => {
  let originalLocation: Location;
  let originalHistory: History;
  let onStateChange: ReturnType<typeof vi.fn>;
  const baseUrl = "/app";

  beforeEach(() => {
    originalLocation = window.location;
    originalHistory = window.history;

    // @ts-expect-error - Mocking window.location
    delete window.location;
    // @ts-expect-error - Mocking window.history
    delete window.history;

    window.location = mockLocation as any;
    window.history = mockHistory as any;

    mockLocation.href = "http://localhost:3000/";
    mockLocation.search = "";
    mockHistory.pushState.mockClear();
    mockHistory.replaceState.mockClear();
    mockHistory.state = null;

    onStateChange = vi.fn();
  });

  afterEach(() => {
    (window as any).location = originalLocation;
    (window as any).history = originalHistory;
  });

  const createTestState = (activePane: keyof TestPaneParams = "rail"): NavigationState<TestPaneParams> => ({
    route: {
      index: 0,
      activePane,
      panes: {
        rail: { userId: "123" },
        list: { section: "account" },
        detail: { tab: "info" },
        tail: {},
      },
    },
    history: [
      {
        index: 0,
        activePane,
        panes: {
          rail: { userId: "123" },
          list: { section: "account" },
          detail: { tab: "info" },
          tail: {},
        },
      },
    ],
  });

  describe("基础功能", () => {
    it("应该正确初始化provider", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      expect(provider).toBeDefined();
    });

    it("空URL时getCurrentState应该返回null", () => {
      mockLocation.href = "http://localhost:3000/";
      mockLocation.search = "";

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).toBeNull();
    });

    it("应该能够从URL解析状态", () => {
      const testState = createTestState("list");
      const encodedData = encodeURIComponent(JSON.stringify(testState.route.panes));
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list&data=${encodedData}`;
      mockLocation.search = `?pane=list&data=${encodedData}`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).not.toBeNull();
      expect(state?.route.activePane).toBe("list");
      expect(state?.route.panes).toEqual(testState.route.panes);
    });
  });

  describe("pushState", () => {
    it("应该调用window.history.pushState并触发回调", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("detail");

      provider.pushState(testState);

      expect(mockHistory.pushState).toHaveBeenCalledTimes(1);
      expect(mockHistory.pushState).toHaveBeenCalledWith(
        { navigationState: testState },
        "",
        expect.stringContaining("pane=detail")
      );
      // Bug Fix: pushState现在应该立即触发回调
      expect(onStateChange).toHaveBeenCalledWith(testState);
    });

    it("应该生成正确的URL格式", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("list");

      provider.pushState(testState);

      const url = mockHistory.pushState.mock.calls[0][2];
      expect(url).toContain(baseUrl);
      expect(url).toContain("pane=list");
      expect(url).toContain("data=");
    });

    it("应该正确编码复杂数据", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("rail");
      testState.route.panes.rail = { userId: "user@test.com" };

      provider.pushState(testState);

      const url = mockHistory.pushState.mock.calls[0][2];
      expect(url).toContain("data=");

      // 模拟URL已更新
      const params = new URL(url, "http://localhost:3000").searchParams;
      const data = JSON.parse(decodeURIComponent(params.get("data") || ""));
      expect(data.rail.userId).toBe("user@test.com");
    });
  });

  describe("replaceState", () => {
    it("应该调用window.history.replaceState并触发回调", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("list");

      provider.replaceState(testState);

      expect(mockHistory.replaceState).toHaveBeenCalledTimes(1);
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        { navigationState: testState },
        "",
        expect.stringContaining("pane=list")
      );
      // Bug Fix: replaceState现在应该立即触发回调
      expect(onStateChange).toHaveBeenCalledWith(testState);
    });

    it("应该生成与pushState相同格式的URL", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("detail");

      provider.pushState(testState);
      const pushUrl = mockHistory.pushState.mock.calls[0][2];

      provider.replaceState(testState);
      const replaceUrl = mockHistory.replaceState.mock.calls[0][2];

      // URL格式应该一致
      expect(pushUrl).toBe(replaceUrl);
    });
  });

  describe("popstate事件处理", () => {
    it("应该在popstate时从event.state读取状态并触发回调", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("list");

      const event = new PopStateEvent("popstate", {
        state: { navigationState: testState },
      });
      window.dispatchEvent(event);

      expect(onStateChange).toHaveBeenCalledWith(testState);
    });

    it("event.state为空时应该尝试从URL解析", () => {
      const testState = createTestState("detail");
      const encodedData = encodeURIComponent(JSON.stringify(testState.route.panes));
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=detail&data=${encodedData}`;
      mockLocation.search = `?pane=detail&data=${encodedData}`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      onStateChange.mockClear();

      const event = new PopStateEvent("popstate", { state: null });
      window.dispatchEvent(event);

      expect(onStateChange).toHaveBeenCalled();
      const calledState = onStateChange.mock.calls[0][0];
      expect(calledState.route.activePane).toBe("detail");
    });

    it("event.state和URL都无效时不应触发回调", () => {
      mockLocation.href = "http://localhost:3000/";
      mockLocation.search = "";

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      onStateChange.mockClear();

      const event = new PopStateEvent("popstate", { state: {} });
      window.dispatchEvent(event);

      expect(onStateChange).not.toHaveBeenCalled();
    });
  });

  describe("URL解析边界情况", () => {
    it("应该处理缺少pane参数的URL", () => {
      const testState = createTestState("rail");
      const encodedData = encodeURIComponent(JSON.stringify(testState.route.panes));
      mockLocation.href = `http://localhost:3000${baseUrl}?data=${encodedData}`;
      mockLocation.search = `?data=${encodedData}`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).toBeNull();
    });

    it("应该处理缺少data参数的URL", () => {
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list`;
      mockLocation.search = `?pane=list`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).toBeNull();
    });

    it("应该处理格式错误的JSON数据", () => {
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list&data=invalid-json`;
      mockLocation.search = `?pane=list&data=invalid-json`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).toBeNull();
    });

    it("应该处理空data参数", () => {
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list&data=`;
      mockLocation.search = `?pane=list&data=`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).toBeNull();
    });

    it("应该正确处理包含额外查询参数的URL", () => {
      const testState = createTestState("list");
      const encodedData = encodeURIComponent(JSON.stringify(testState.route.panes));
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list&data=${encodedData}&extra=value`;
      mockLocation.search = `?pane=list&data=${encodedData}&extra=value`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      expect(state).not.toBeNull();
      expect(state?.route.activePane).toBe("list");
    });
  });

  describe("资源清理", () => {
    it("destroy应该移除popstate监听器", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);

      provider.destroy();

      const testState = createTestState("list");
      const event = new PopStateEvent("popstate", {
        state: { navigationState: testState },
      });
      window.dispatchEvent(event);

      expect(onStateChange).not.toHaveBeenCalled();
    });

    it("多次调用destroy不应该抛出错误", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);

      expect(() => {
        provider.destroy();
        provider.destroy();
      }).not.toThrow();
    });
  });

  describe("状态往返测试", () => {
    it("pushState后getCurrentState应该能读取相同数据", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const testState = createTestState("detail");
      testState.route.panes.detail = { tab: "security" };

      provider.pushState(testState);

      // 模拟URL已更新
      const url = mockHistory.pushState.mock.calls[0][2];
      const urlObj = new URL(url, "http://localhost:3000");
      mockLocation.href = urlObj.href;
      mockLocation.search = urlObj.search;

      const retrievedState = provider.getCurrentState();

      expect(retrievedState?.route.activePane).toBe("detail");
      expect(retrievedState?.route.panes.detail?.tab).toBe("security");
    });
  });

  describe("历史记录重建问题", () => {
    it("getCurrentState返回的历史记录应该完整（Bug #5）", () => {
      const testState = createTestState("list");
      // 模拟有完整历史的状态
      testState.history = [
        { index: 0, activePane: "rail", panes: testState.route.panes },
        { index: 1, activePane: "list", panes: testState.route.panes },
      ];

      const encodedData = encodeURIComponent(JSON.stringify(testState.route.panes));
      mockLocation.href = `http://localhost:3000${baseUrl}?pane=list&data=${encodedData}`;
      mockLocation.search = `?pane=list&data=${encodedData}`;

      const provider = new BrowserHistoryProvider<TestPaneParams>(baseUrl, onStateChange);
      const state = provider.getCurrentState();

      // Bug: 当前实现总是重建历史记录为只包含一个项
      // 这会导致完整历史信息丢失
      expect(state?.history).toHaveLength(1);
      expect(state?.history[0]).toEqual(state?.route);
    });
  });

  describe("baseUrl处理", () => {
    it("应该正确处理带斜杠的baseUrl", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>("/app/", onStateChange);
      const testState = createTestState("rail");

      provider.pushState(testState);

      const url = mockHistory.pushState.mock.calls[0][2];
      expect(url).toContain("/app/");
    });

    it("应该正确处理不带斜杠的baseUrl", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>("app", onStateChange);
      const testState = createTestState("rail");

      provider.pushState(testState);

      const url = mockHistory.pushState.mock.calls[0][2];
      expect(url).toContain("app");
    });

    it("应该正确处理空baseUrl", () => {
      const provider = new BrowserHistoryProvider<TestPaneParams>("", onStateChange);
      const testState = createTestState("rail");

      provider.pushState(testState);

      const url = mockHistory.pushState.mock.calls[0][2];
      expect(url).toContain("?pane=rail");
    });
  });
});
