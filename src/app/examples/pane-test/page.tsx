"use client";

import { AppBar, Scaffold } from "@/components/scaffold";
import type { NavigationState, PaneParams } from "@/components/scaffold/scaffold";
import { ChevronLeft, ChevronRight, Home, Layers, Settings, Users } from "lucide-react";
import * as React from "react";

// 定义我们的参数类型
interface MyPaneParams extends PaneParams {
  rail: { section?: string };
  list: { category?: string };
  detail: { itemId?: string };
  tail: { settingTab?: string };
}

export default function PaneTestPage() {
  // 导航状态
  const [navState, setNavState] = React.useState<NavigationState<MyPaneParams>>({
    route: {
      index: 0,
      activePane: "rail",
      panes: {
        rail: { section: "home" },
        list: { category: "all" },
        detail: { itemId: "1" },
        tail: { settingTab: "general" },
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
          tail: { settingTab: "general" },
        },
      },
    ],
  });

  return (
    <Scaffold<MyPaneParams>
      appBar={
        <AppBar
          title={
            <div className="flex items-center gap-2">
              <Layers size={20} />
              <span className="font-bold">Pane System Test</span>
              <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-xs">
                Active: {navState.route.activePane}
              </span>
            </div>
          }
        />
      }
      navigationState={navState}
      onNavigationChange={(newState, reason) => {
        console.log("Navigation changed:", { newState, reason });
        setNavState(newState);
      }}
      rail={({ railPosition, navigate, breakpoint, isActive }) => (
        <div className="bg-muted/30 flex h-full flex-col p-4">
          <div className="mb-4 rounded-lg border bg-blue-50 p-3 dark:bg-blue-950">
            <h3 className="mb-2 text-sm font-bold">🚂 Rail Pane</h3>
            <div className="space-y-1 text-xs">
              <div>Position: {railPosition}</div>
              <div>Breakpoint: {breakpoint || "null"}</div>
              <div>Active: {isActive ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate("list", { category: "recent" })}
              className={`hover:bg-accent flex w-full items-center gap-2 rounded-lg p-3 transition-colors ${
                navState.route.activePane === "list" ? "bg-primary/10" : ""
              }`}>
              <Home size={20} />
              <span>Go to List</span>
            </button>

            <button
              onClick={() => navigate("detail", { itemId: "42" })}
              className={`hover:bg-accent flex w-full items-center gap-2 rounded-lg p-3 transition-colors ${
                navState.route.activePane === "detail" ? "bg-primary/10" : ""
              }`}>
              <Users size={20} />
              <span>Go to Detail</span>
            </button>

            <button
              onClick={() => navigate("tail", { settingTab: "advanced" })}
              className={`hover:bg-accent flex w-full items-center gap-2 rounded-lg p-3 transition-colors ${
                navState.route.activePane === "tail" ? "bg-primary/10" : ""
              }`}>
              <Settings size={20} />
              <span>Go to Tail</span>
            </button>
          </div>
        </div>
      )}
      list={({ params, navigate, canGoBack, canGoForward, back, forward, breakpoint, isActive }) => (
        <div className="bg-background flex h-full flex-col p-4">
          <div className="mb-4 rounded-lg border bg-green-50 p-3 dark:bg-green-950">
            <h3 className="mb-2 text-sm font-bold">📋 List Pane</h3>
            <div className="space-y-1 text-xs">
              <div>Category: {params.category}</div>
              <div>Breakpoint: {breakpoint || "null"}</div>
              <div>Active: {isActive ? "Yes" : "No"}</div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={back}
              disabled={!canGoBack}
              className="bg-primary text-primary-foreground disabled:opacity-50 flex items-center gap-1 rounded px-3 py-2 text-sm disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
              Back
            </button>
            <button
              onClick={forward}
              disabled={!canGoForward}
              className="bg-primary text-primary-foreground disabled:opacity-50 flex items-center gap-1 rounded px-3 py-2 text-sm disabled:cursor-not-allowed">
              Forward
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Sample list items */}
          <div className="space-y-2">
            {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate("detail", { itemId: String(i + 1) })}
                className="hover:bg-accent w-full rounded-lg border p-4 text-left transition-colors">
                <div className="font-semibold">{item}</div>
                <div className="text-muted-foreground text-sm">Click to view details</div>
              </button>
            ))}
          </div>
        </div>
      )}
      detail={({ params, navigate, breakpoint, isActive }) => (
        <div className="bg-background flex h-full flex-col p-4">
          <div className="mb-4 rounded-lg border bg-purple-50 p-3 dark:bg-purple-950">
            <h3 className="mb-2 text-sm font-bold">📄 Detail Pane</h3>
            <div className="space-y-1 text-xs">
              <div>Item ID: {params.itemId}</div>
              <div>Breakpoint: {breakpoint || "null"}</div>
              <div>Active: {isActive ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-2xl font-bold">Item #{params.itemId}</h2>
            <p className="text-muted-foreground mb-4">
              This is the detail view for item {params.itemId}. The detail pane shows the full content of the selected
              item.
            </p>

            <button
              onClick={() => navigate("tail", { settingTab: "info" })}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
              Open Tail Panel
            </button>
          </div>

          {/* Some scrollable content */}
          <div className="mt-6 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded border p-4">
                <h4 className="font-semibold">Section {i + 1}</h4>
                <p className="text-muted-foreground text-sm">Additional content section</p>
              </div>
            ))}
          </div>
        </div>
      )}
      tail={({ params, navigate, breakpoint, isActive }) => (
        <div className="bg-muted/50 flex h-full flex-col p-4">
          <div className="mb-4 rounded-lg border bg-amber-50 p-3 dark:bg-amber-950">
            <h3 className="mb-2 text-sm font-bold">⚙️ Tail Pane</h3>
            <div className="space-y-1 text-xs">
              <div>Setting Tab: {params.settingTab}</div>
              <div>Breakpoint: {breakpoint || "null"}</div>
              <div>Active: {isActive ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" />
                  <span className="text-sm">Enable notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-primary" defaultChecked />
                  <span className="text-sm">Auto-save</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => navigate("list", { category: "settings" })}
              className="hover:bg-accent w-full rounded-lg border p-3 transition-colors">
              Back to List
            </button>
          </div>
        </div>
      )}
    />
  );
}
