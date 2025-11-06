
import { MemoryNavigationProvider } from "../memory-navigation-provider";

describe("MemoryNavigationProvider", () => {
  it("should initialize with a default entry", () => {
    const provider = new MemoryNavigationProvider();
    expect(provider.currentEntry).not.toBeNull();
    expect(provider.currentEntry?.url).toBe("/");
    expect(provider.entries).toHaveLength(1);
  });

  it("should navigate to a new URL", () => {
    const provider = new MemoryNavigationProvider();
    provider.navigate("/foo");
    expect(provider.currentEntry?.url).toBe("/foo");
    expect(provider.entries).toHaveLength(2);
  });

  it("should go back and forward", () => {
    const provider = new MemoryNavigationProvider();
    provider.navigate("/foo");
    provider.navigate("/bar");
    provider.back();
    expect(provider.currentEntry?.url).toBe("/foo");
    provider.forward();
    expect(provider.currentEntry?.url).toBe("/bar");
  });

  it("should replace the current entry", () => {
    const provider = new MemoryNavigationProvider();
    provider.navigate("/foo");
    provider.navigate("/bar", { history: "replace" });
    expect(provider.currentEntry?.url).toBe("/bar");
    expect(provider.entries).toHaveLength(2);
  });

  it("should traverse to a specific entry", () => {
    const provider = new MemoryNavigationProvider();
    provider.navigate("/foo");
    const key = provider.currentEntry!.key;
    provider.navigate("/bar");
    provider.traverseTo(key);
    expect(provider.currentEntry?.url).toBe("/foo");
  });
});
