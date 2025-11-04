"use client";

/* eslint-disable no-console */

import * as React from "react";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  MenubarSeparator,
  TopNavbar,
  TopNavbarActions,
  TopNavbarActionsItem,
  TopNavbarActionsMenu,
  TopNavbarActionsSubItem,
  TopNavbarBackButton,
  TopNavbarBreadcrumb,
  TopNavbarNav,
  TopNavbarTitle,
  type HistoryItem,
} from "@/components/scaffold/top-navbar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User, Search, HelpCircle } from "lucide-react";

export default function TopNavbarExample() {
  const [currentPage, setCurrentPage] = React.useState("Dashboard");
  const [history, setHistory] = React.useState<HistoryItem[]>([
    { title: "Home", onClick: () => handleNavigate("Home") },
    { title: "Projects", onClick: () => handleNavigate("Projects") },
    { title: "Team", onClick: () => handleNavigate("Team") },
  ]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const lastPage = history[history.length - 1];
      lastPage.onClick?.();
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      {/* Top Navbar Example */}
      <TopNavbar>
        <TopNavbarNav>
          <TopNavbarBackButton onBack={handleBack} historyItems={history} disabled={history.length === 0} />
          <TopNavbarBreadcrumb>
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
          </TopNavbarBreadcrumb>
        </TopNavbarNav>

        <TopNavbarTitle>{currentPage}</TopNavbarTitle>

        <TopNavbarActions>
          <Button variant="ghost" size="icon-sm">
            <Search />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Bell />
          </Button>

          <TopNavbarActionsMenu>
            <TopNavbarActionsItem label="File">
              <TopNavbarActionsSubItem onSelect={() => console.log("New")}>New</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Open")}>Open</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Save")}>Save</TopNavbarActionsSubItem>
              <MenubarSeparator />
              <TopNavbarActionsSubItem onSelect={() => console.log("Exit")}>Exit</TopNavbarActionsSubItem>
            </TopNavbarActionsItem>

            <TopNavbarActionsItem label="Edit">
              <TopNavbarActionsSubItem onSelect={() => console.log("Undo")}>Undo</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Redo")}>Redo</TopNavbarActionsSubItem>
              <MenubarSeparator />
              <TopNavbarActionsSubItem onSelect={() => console.log("Cut")}>Cut</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Copy")}>Copy</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Paste")}>Paste</TopNavbarActionsSubItem>
            </TopNavbarActionsItem>

            <TopNavbarActionsItem label="View">
              <TopNavbarActionsSubItem onSelect={() => console.log("Zoom In")}>Zoom In</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Zoom Out")}>Zoom Out</TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Reset Zoom")}>
                Reset Zoom
              </TopNavbarActionsSubItem>
            </TopNavbarActionsItem>

            <TopNavbarActionsItem label={<HelpCircle className="size-4" />} onSelect={() => console.log("Help")}>
              <TopNavbarActionsSubItem onSelect={() => console.log("Documentation")}>
                Documentation
              </TopNavbarActionsSubItem>
              <TopNavbarActionsSubItem onSelect={() => console.log("Support")}>Support</TopNavbarActionsSubItem>
              <MenubarSeparator />
              <TopNavbarActionsSubItem onSelect={() => console.log("About")}>About</TopNavbarActionsSubItem>
            </TopNavbarActionsItem>
          </TopNavbarActionsMenu>

          <Button variant="ghost" size="icon-sm">
            <User />
          </Button>
        </TopNavbarActions>
      </TopNavbar>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Top Navbar Example</h1>
          <p className="mb-8 text-muted-foreground">
            Resize the window to see the responsive behavior. The navbar switches between full and compact modes.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-4 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Features:</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Responsive Nav:</strong> Shows breadcrumb in full mode, only back button in compact mode
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Back Button Long Press:</strong> Long press the back button to see navigation history
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Responsive Actions:</strong> Shows menubar in full mode, dropdown menu in compact mode
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Customizable Title:</strong> Center title area can display any content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <strong>Container Query:</strong> Uses @container queries for responsive behavior (breakpoint at
                @3xl)
              </span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setHistory((prev) => [...prev, { title: currentPage, onClick: () => handleNavigate(currentPage) }]);
              setCurrentPage("New Page");
            }}>
            Navigate to New Page
          </Button>
          <Button variant="outline" onClick={handleBack} disabled={history.length === 0}>
            Go Back
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Current Page: {currentPage}</p>
          <p>History Length: {history.length}</p>
        </div>
      </main>
    </div>
  );
}
