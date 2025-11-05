"use client";

/* eslint-disable no-console */

import {
  ActionItem,
  ActionsBar,
  ActionSeparator,
  ActionSubItem,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  NavBar,
  TitleBar,
  type NavHistoryItem,
} from "@/components/scaffold/appbar";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, type DevicePresetConfig } from "@/components/ui/responsive-container";
import { obj_pick } from "@gaubee/util";
import * as React from "react";

const HEIGHT = 100;
// 自定义 AppBar 测试的设备预设
const APPBAR_TEST_PRESETS = {
  "60": {
    width: 60,
    height: HEIGHT,
    label: "60px",
    icon: () => <span>60</span>,
  },
  "120": {
    width: 120,
    height: HEIGHT,
    label: "120px",
    icon: () => <span>120</span>,
  },
  "240": {
    width: 240,
    height: HEIGHT,
    label: "240px",
    icon: () => <span>240</span>,
  },
  "360": {
    width: 360,
    height: HEIGHT,
    label: "360px",
    icon: () => <span>360</span>,
  },
  "512": {
    width: 512,
    height: HEIGHT,
    label: "512px",
    icon: () => <span>512</span>,
  },
  "768": {
    width: 768,
    height: HEIGHT,
    label: "768px",
    icon: () => <span>768</span>,
  },
  "1024": {
    width: 1024,
    height: HEIGHT,
    label: "1024px",
    icon: () => <span>1024</span>,
  },
  "1280": {
    width: 1280,
    height: HEIGHT,
    label: "1280px",
    icon: () => <span>1280</span>,
  },
} as const satisfies Record<string, DevicePresetConfig>;

const getDevicePresets = <const T extends keyof typeof APPBAR_TEST_PRESETS>(keys: readonly T[], height = HEIGHT) => {
  const res = obj_pick(APPBAR_TEST_PRESETS, ...keys);
  if (height != null) {
    for (const key of keys) {
      res[key] = { ...res[key], height };
    }
  }
  return res;
};

export default function AppBarResponsiveExample() {
  const [currentPage, setCurrentPage] = React.useState("Dashboard");
  const [history, setHistory] = React.useState<NavHistoryItem[]>([
    { title: "Home", onClick: () => handleNavigate("Home") },
    { title: "Projects", onClick: () => handleNavigate("Projects") },
  ]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setHistory((prev) => [...prev, { title: currentPage, onClick: () => handleNavigate(currentPage) }]);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const lastPage = history[history.length - 1];
      lastPage.onClick?.();
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  // 共享的 Actions 内容
  const actionsContent = (
    <>
      <ActionItem key="file" label="File">
        <ActionSubItem key="new" onSelect={() => console.log("New")}>
          New
        </ActionSubItem>
        <ActionSubItem key="open" onSelect={() => console.log("Open")}>
          Open
        </ActionSubItem>
        <ActionSubItem key="save" onSelect={() => console.log("Save")}>
          Save
        </ActionSubItem>
        <ActionSeparator />
        <ActionSubItem key="exit" onSelect={() => console.log("Exit")}>
          Exit
        </ActionSubItem>
      </ActionItem>

      <ActionItem key="edit" label="Edit">
        <ActionSubItem key="undo" onSelect={() => console.log("Undo")}>
          Undo
        </ActionSubItem>
        <ActionSubItem key="redo" onSelect={() => console.log("Redo")}>
          Redo
        </ActionSubItem>
        <ActionSeparator />
        <ActionSubItem key="cut" onSelect={() => console.log("Cut")}>
          Cut
        </ActionSubItem>
        <ActionSubItem key="copy" onSelect={() => console.log("Copy")}>
          Copy
        </ActionSubItem>
        <ActionSubItem key="paste" onSelect={() => console.log("Paste")}>
          Paste
        </ActionSubItem>
      </ActionItem>

      <ActionItem key="view" label="View">
        <ActionSubItem key="zoom-in" onSelect={() => console.log("Zoom In")}>
          Zoom In
        </ActionSubItem>
        <ActionSubItem key="zoom-out" onSelect={() => console.log("Zoom Out")}>
          Zoom Out
        </ActionSubItem>
        <ActionSubItem key="reset-zoom" onSelect={() => console.log("Reset Zoom")}>
          Reset Zoom
        </ActionSubItem>
      </ActionItem>
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 p-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">AppBar 响应式测试</h1>
        <p className="text-muted-foreground mb-2">独立测试每个组件的响应式行为，然后测试组合效果</p>
        <p className="text-muted-foreground text-sm">
          拖拽右下角调整容器大小，观察组件如何根据实际内容尺寸自动切换变体
        </p>
      </div>

      {/* NavBar 独立测试 */}
      <div className="w-full">
        <ResponsiveContainer
          title="1. NavBar 独立测试"
          devicePresets={getDevicePresets(["120", "360", "768"])}
          initialDevice="360"
          initialScale={0.8}>
          <div className="bg-background flex h-18 items-center p-2">
            <NavBar
              className="border p-2"
              onBack={handleBack}
              historyItems={history}
              disabled={history.length === 0}
              breadcrumb={
                <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => handleNavigate("Home")}>
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => handleNavigate("Projects")}>
                      Projects
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              }
            />
          </div>
        </ResponsiveContainer>
      </div>

      {/* TitleBar 独立测试 */}
      {false ? null : (
        <div className="w-full">
          <ResponsiveContainer
            title="2. TitleBar 独立测试"
            devicePresets={getDevicePresets(["120", "360", "768"], 120)}
            initialDevice="768"
            initialScale={0.8}>
            <div className="bg-background flex size-full items-center justify-center p-2">
              <TitleBar
                className="border p-2"
                title={currentPage}
                subtitle="Optional subtitle for testing expanded variant"
              />
            </div>
          </ResponsiveContainer>
        </div>
      )}

      {/* ActionsBar 独立测试 */}
      {false ? null : (
        <div className="w-full">
          <ResponsiveContainer
            title="3. ActionsBar 独立测试"
            devicePresets={getDevicePresets(["120", "360", "768"])}
            initialDevice="360"
            initialScale={0.8}>
            <div className="bg-background flex h-18 items-center justify-end p-2">
              <ActionsBar className="border p-2">{actionsContent}</ActionsBar>
            </div>
          </ResponsiveContainer>
        </div>
      )}

      {/* 组合测试 */}
      {false ? null : (
        <div className="w-full">
          <ResponsiveContainer
            title="4. 组合测试（完整 AppBar）"
            devicePresets={getDevicePresets(["360", "768", "1280"], 200)}
            initialDevice="768"
            initialScale={0.8}>
            <div className="flex h-full w-full flex-col">
              {/* AppBar */}
              <header className="bg-background flex h-18 w-full items-center justify-between border p-2">
                {/* NavBar */}
                <NavBar
                  onBack={handleBack}
                  historyItems={history}
                  disabled={history.length === 0}
                  breadcrumb={
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#" onClick={() => handleNavigate("Home")}>
                          Home
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#" onClick={() => handleNavigate("Projects")}>
                          Projects
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  }
                />

                {/* TitleBar */}
                <TitleBar title={currentPage} subtitle="Optional subtitle" />

                {/* ActionsBar */}
                <ActionsBar>{actionsContent}</ActionsBar>
              </header>

              {/* Main Content */}
              <main className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold">当前页面: {currentPage}</h2>
                  <p className="text-muted-foreground text-sm">历史记录长度: {history.length}</p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => handleNavigate(`Page-${Date.now()}`)}>导航到新页面</Button>
                  <Button variant="outline" onClick={handleBack} disabled={history.length === 0}>
                    返回
                  </Button>
                </div>
              </main>
            </div>
          </ResponsiveContainer>
        </div>
      )}
      {/* 说明文档 */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">响应式行为说明</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-2 font-medium">NavBar（导航栏）</h3>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>
                <strong>Compact 变体：</strong>只显示返回按钮
              </li>
              <li>
                <strong>Full 变体：</strong>显示返回按钮 + 面包屑导航
              </li>
              <li>根据实际内容宽度自动切换，不依赖固定断点</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-medium">TitleBar（标题栏）</h3>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>
                <strong>Compact 变体：</strong>单行标题，文本截断（truncate）
              </li>
              <li>
                <strong>Normal 变体：</strong>单行标题，完整显示
              </li>
              <li>
                <strong>Expanded 变体：</strong>多行显示，包含副标题
              </li>
              <li>基于容器空间和内容尺寸自动选择最佳变体</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-medium">ActionsBar（操作栏）</h3>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>
                <strong>Compact 变体：</strong>使用 DropdownMenu（汉堡菜单）
              </li>
              <li>
                <strong>Full 变体：</strong>使用 NavigationMenu（横向展开）
              </li>
              <li>根据所有菜单项的总宽度自动切换</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-medium">核心技术</h3>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>
                <strong>Grid 布局：</strong>使用 CSS Grid 的 grid-area 让所有变体占据同一个网格区域
              </li>
              <li>
                <strong>Record 结构：</strong>变体配置使用 Record 对象，支持类型安全
              </li>
              <li>
                <strong>Strategy Provider：</strong>支持 adjacentProvider（邻近渲染）和 fullProvider（全量渲染）
              </li>
              <li>
                <strong>ResizeObserver：</strong>监听容器尺寸变化，实时选择最佳变体
              </li>
              <li>
                <strong>无固定断点：</strong>完全基于实际内容尺寸，不依赖预设断点
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-medium">测试建议</h3>
            <ul className="text-muted-foreground ml-6 list-disc space-y-1">
              <li>先测试每个组件的独立面板，观察各自的响应式行为</li>
              <li>调整容器宽度，找到每个变体切换的临界点</li>
              <li>在组合面板中观察三个组件如何协同工作</li>
              <li>点击顶部的设备预设按钮，快速切换到不同宽度</li>
              <li>使用 Chrome DevTools 检查 DOM 结构，验证 Grid 布局</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
