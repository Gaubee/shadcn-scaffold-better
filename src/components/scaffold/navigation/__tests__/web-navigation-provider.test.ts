
import { WebNavigationProvider } from "../web-navigation-provider";

// @vitest-environment jsdom
describe("WebNavigationProvider", () => {
  it("should initialize with the current URL", () => {
    const provider = new WebNavigationProvider();
    expect(provider.currentEntry).not.toBeNull();
    expect(provider.currentEntry?.url).toBe("http://localhost:3000/");
  });
});
