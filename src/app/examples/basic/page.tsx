"use client";

import { AppBar, Scaffold } from "@/components/scaffold";
import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Home, Layers, Settings, User } from "lucide-react";
import * as React from "react";

// 定义参数类型
interface BasicPaneParams extends PaneParams {
  rail: { section?: string };
  list: { category?: string };
  detail: { itemId?: string };
  tail: Record<string, never>;
}

// 模拟数据
const SAMPLE_ITEMS = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  title: `Item ${i + 1}`,
  description: "Click to view details",
}));

export default function BasicPage() {
  const [navState, setNavState] = React.useState<NavigationState<BasicPaneParams>>({
    route: {
      index: 0,
      activePane: "rail",
      panes: {
        rail: { section: "home" },
        list: { category: "all" },
        detail: { itemId: "1" },
        tail: {},
      },
    },
    history: [
      {
        index: 0,
        activePane: "rail",
        panes: {
          rail: { section: "home" },
          list: { category: "all" },
          detail: { itemId: "1" },
          tail: {},
        },
      },
    ],
  });

  return (
    <Scaffold<BasicPaneParams>
      appBar={
        <AppBar
          title={
            <div className="flex items-center gap-2">
              <Layers size={20} />
              <span className="font-bold">Basic Example</span>
            </div>
          }
        />
      }
      navigationState={navState}
      onNavigationChange={setNavState}
      rail={({ railPosition, navigate }) => {
        const isHorizontal = railPosition === "block-end";
        const flexDirection = isHorizontal ? "flex-row" : "flex-col";

        return (
          <div className={cn("bg-muted/30 flex h-full w-full gap-2 p-4", flexDirection)}>
            <Button
              variant={navState.route.activePane === "list" ? "default" : "ghost"}
              className={cn("w-full justify-start", isHorizontal && "flex-col")}
              onClick={() => navigate("list", { category: "all" })}
            >
              <Home />
              <span>Home</span>
            </Button>

            <Button
              variant={navState.route.activePane === "detail" ? "default" : "ghost"}
              className={cn("w-full justify-start", isHorizontal && "flex-col")}
              onClick={() => navigate("detail", { itemId: "1" })}
            >
              <User />
              <span>Detail</span>
            </Button>

            <Button
              variant={navState.route.activePane === "tail" ? "default" : "ghost"}
              className={cn("w-full justify-start", isHorizontal && "flex-col")}
              onClick={() => navigate("tail", {})}
            >
              <Settings />
              <span>Settings</span>
            </Button>
          </div>
        );
      }}
      list={({ navigate, canGoBack, canGoForward, back, forward }) => (
        <div className="bg-background flex h-full flex-col gap-4 p-4">
          <div className="flex gap-2">
            <Button onClick={back} disabled={!canGoBack} variant="outline" size="sm">
              <ChevronLeft />
              Back
            </Button>
            <Button onClick={forward} disabled={!canGoForward} variant="outline" size="sm">
              Forward
              <ChevronRight />
            </Button>
          </div>

          <div className="space-y-2">
            {SAMPLE_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="h-auto w-full flex-col items-start justify-start p-4"
                onClick={() => navigate("detail", { itemId: item.id })}
              >
                <div className="font-semibold">{item.title}</div>
                <div className="text-muted-foreground text-sm">{item.description}</div>
              </Button>
            ))}
          </div>
        </div>
      )}
      detail={({ params, navigate }) => {
        const item = SAMPLE_ITEMS.find((i) => i.id === params.itemId);
        return (
          <div className="bg-background flex h-full flex-col gap-6 p-4">
            <div className="rounded-lg border p-6">
              <h2 className="mb-2 text-2xl font-bold">{item?.title ?? "Item Not Found"}</h2>
              <p className="text-muted-foreground mb-4">
                This is the detail view for item {params.itemId}. The detail pane shows the full content of the
                selected item.
              </p>

              <Button onClick={() => navigate("tail", {})}>Open Settings</Button>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <h4 className="font-semibold">Section {i + 1}</h4>
                  <p className="text-muted-foreground text-sm">Additional content section with details.</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
      tail={({ navigate, isActive }) =>
        isActive ? (
          <div className="bg-muted/50 flex h-full flex-col gap-4 p-4 backdrop-blur-sm">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-4 font-semibold">Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  <span className="text-sm">Enable notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" defaultChecked />
                  <span className="text-sm">Auto-save</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  <span className="text-sm">Dark mode</span>
                </label>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate("list", { category: "all" })}>
              Back to List
            </Button>
          </div>
        ) : null
      }
    />
  );
}
